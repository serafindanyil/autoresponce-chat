import {
	describe,
	it,
	expect,
	beforeAll,
	afterAll,
	beforeEach,
	vi,
} from "vitest";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { io as createClient, type Socket } from "socket.io-client";
import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "@/app";
import { createSocketServer } from "@/sockets";
import { ServerEvents } from "@/sockets/events";
import { env } from "@/config/env";
import { ChatModel, MessageModel, UserModel } from "@/models";
import type {
	ChatBootstrapItem,
	ChatPatchPayload,
} from "@/services/chat-sync.service";

const verifyIdTokenMock = vi.fn();

vi.mock("google-auth-library", () => ({
	OAuth2Client: vi.fn().mockImplementation(() => ({
		verifyIdToken: verifyIdTokenMock,
	})),
}));

vi.mock("@/services/quote.service", () => ({
	fetchQuote: vi.fn().mockResolvedValue({
		content: "Keep learning",
		author: "Test Bot",
	}),
}));

const TEST_GOOGLE_TOKEN = "test-google-token";
const TEST_USER_EMAIL = "user@example.com";

const app = createApp();
const httpServer = createServer(app);
const ioServer = createSocketServer(httpServer);
let baseUrl: string;

beforeAll(async () => {
	await new Promise<void>((resolve) => {
		httpServer.listen(0, () => resolve());
	});
	const address = httpServer.address() as AddressInfo;
	baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
	ioServer.close();
	await new Promise<void>((resolve, reject) => {
		httpServer.close((error) => (error ? reject(error) : resolve()));
	});
});

beforeEach(() => {
	verifyIdTokenMock.mockReset();
	process.env.GOOGLE_TEST_TOKEN = TEST_GOOGLE_TOKEN;
	process.env.GOOGLE_TEST_USER_EMAIL = TEST_USER_EMAIL;
	process.env.GOOGLE_TEST_USER_ID = "google-test-id";
	process.env.GOOGLE_TEST_USER_NAME = "Test User";
	process.env.GOOGLE_TEST_USER_AVATAR = "https://example.com/avatar.png";
});

async function authenticate(): Promise<{ jwtToken: string; userId: string }> {
	const response = await request(app)
		.post("/api/auth/google")
		.send({ token: TEST_GOOGLE_TOKEN });

	return {
		jwtToken: response.body.token,
		userId: response.body.user.id,
	};
}

async function connectClient(jwtToken: string): Promise<Socket> {
	return await new Promise<Socket>((resolve, reject) => {
		const client = createClient(baseUrl, {
			transports: ["websocket"],
			reconnection: false,
			auth: { token: jwtToken },
		});

		client.once("connect", () => resolve(client));
		client.once("connect_error", (error) => reject(error));
	});
}

async function waitForBootstrap(socket: Socket): Promise<ChatBootstrapItem[]> {
	return await new Promise<ChatBootstrapItem[]>((resolve) => {
		socket.once(ServerEvents.ChatsBootstrap, (payload) => resolve(payload));
	});
}

async function waitForPatch(socket: Socket): Promise<ChatPatchPayload> {
	return await new Promise<ChatPatchPayload>((resolve) => {
		socket.once(ServerEvents.ChatPatch, (payload) => resolve(payload));
	});
}

describe("Health endpoint", () => {
	it("returns healthy status", async () => {
		const response = await request(app).get("/health");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ status: "healthy" });
	});
});

describe("Authentication flow", () => {
	it("issues jwt and provisions default chats", async () => {
		const { jwtToken, userId } = await authenticate();
		const decoded = jwt.verify(jwtToken, env.jwtSecret) as jwt.JwtPayload;

		expect(decoded.email).toBe(TEST_USER_EMAIL);
		expect(decoded.id).toBe(userId);

		const chats = await ChatModel.find({ ownerId: userId }).lean();
		expect(chats).toHaveLength(3);
		const chatIds = chats.map((chat) => chat._id);
		const seededMessages = await MessageModel.find({
			chatId: { $in: chatIds },
		}).lean();
		expect(seededMessages).toHaveLength(3);
	});

	it("supports Google token verification fallback", async () => {
		process.env.GOOGLE_TEST_TOKEN = "";
		verifyIdTokenMock.mockResolvedValue({
			getPayload: () => ({
				email: TEST_USER_EMAIL,
				sub: "google-123",
				name: "Verified User",
				picture: "https://example.com/verified.png",
			}),
		});

		const response = await request(app)
			.post("/api/auth/google")
			.send({ token: "remote-token" });

		expect(response.status).toBe(200);
		expect(verifyIdTokenMock).toHaveBeenCalled();
		expect(response.body.user.email).toBe(TEST_USER_EMAIL);
	});
});

describe("Socket synchronization", () => {
	it("sends initial chats snapshot after authentication", async () => {
		const { jwtToken } = await authenticate();
		const client = await connectClient(jwtToken);

		const bootstrap = await waitForBootstrap(client);
		expect(Array.isArray(bootstrap)).toBe(true);
		expect(bootstrap).toHaveLength(3);
		bootstrap.forEach((item) => {
			expect(item.messages).toHaveLength(1);
		});

		client.disconnect();
	});

	it("pushes updates when messages change", async () => {
		vi.useFakeTimers();
		try {
			const { jwtToken, userId } = await authenticate();
			const client = await connectClient(jwtToken);
			await waitForBootstrap(client);

			const chat = await ChatModel.findOne({ ownerId: userId }).lean();
			expect(chat).not.toBeNull();

			const updatePromise = waitForPatch(client);
			const response = await request(app)
				.post(`/api/chats/${chat!._id.toString()}/messages`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.send({ text: "Hello" });

			expect(response.status).toBe(201);
			const firstUpdate = await updatePromise;
			expect(firstUpdate.chatId).toBe(chat!._id.toString());
			expect(firstUpdate.chat).toBeDefined();
			expect(firstUpdate.messages).toBeDefined();
			expect(firstUpdate.messages?.length ?? 0).toBeGreaterThanOrEqual(2);

			const autoReplyPromise = waitForPatch(client);
			await vi.advanceTimersByTimeAsync(3000);
			const autoReplyUpdate = await autoReplyPromise;
			expect(autoReplyUpdate.chatId).toBe(chat!._id.toString());
			expect(autoReplyUpdate.messages?.length ?? 0).toBeGreaterThanOrEqual(3);

			client.disconnect();
		} finally {
			vi.useRealTimers();
		}
	});
});

describe("Authorization guard", () => {
	it("rejects unauthenticated message creation", async () => {
		const owner = await UserModel.create({
			email: "owner@example.com",
			name: "Owner",
			provider: "google",
			providerId: "owner",
		});
		const chat = await ChatModel.create({
			ownerId: owner._id,
			firstName: "Ada",
			lastName: "Lovelace",
		});

		const response = await request(app)
			.post(`/api/chats/${chat._id.toString()}/messages`)
			.send({ text: "Hello" });

		expect(response.status).toBe(401);
	});
});
