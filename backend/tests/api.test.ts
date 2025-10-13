import { describe, it, expect, beforeEach, vi } from "vitest";

const verifyIdTokenMock = vi.fn();

vi.mock("google-auth-library", () => {
	return {
		OAuth2Client: vi.fn().mockImplementation(() => ({
			verifyIdToken: verifyIdTokenMock,
		})),
	};
});

vi.mock("@/services/auto-reply.service", () => ({
	scheduleAutoReply: vi.fn(),
}));

import request from "supertest";
import { createApp } from "@/app";
import { ChatModel, MessageModel, UserModel } from "@/models";
import { scheduleAutoReply } from "@/services/auto-reply.service";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

const app = createApp();
const scheduleAutoReplyMock = vi.mocked(scheduleAutoReply);

describe("Health endpoint", () => {
	it("returns healthy status", async () => {
		const response = await request(app).get("/health");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ status: "healthy" });
	});
});

describe("Test endpoint", () => {
	it("returns application status", async () => {
		const response = await request(app).get("/api/test");

		expect(response.status).toBe(200);
		expect(response.body.status).toBe("ok");
		expect(response.body.message).toBe("Test endpoint is reachable.");
		expect(response.body.totalUsers).toBe(0);
	});
});

describe("Chat endpoints", () => {
	beforeEach(() => {
		scheduleAutoReplyMock.mockClear();
	});

	it("creates, lists, updates, and deletes a chat", async () => {
		const createPayload = { firstName: "Ada", lastName: "Lovelace" };
		const createResponse = await request(app)
			.post("/api/chats")
			.send(createPayload);

		expect(createResponse.status).toBe(201);
		expect(createResponse.body.firstName).toBe("Ada");
		expect(createResponse.body.lastName).toBe("Lovelace");

		const chatId = createResponse.body._id;

		const listResponse = await request(app).get("/api/chats");
		expect(listResponse.status).toBe(200);
		expect(listResponse.body).toHaveLength(1);

		const messagesResponse = await request(app).get(
			`/api/chats/${chatId}/messages`
		);
		expect(messagesResponse.status).toBe(200);
		expect(messagesResponse.body).toEqual([]);

		const updatePayload = {
			metadata: { avatarUrl: "https://example.com/avatar.png" },
		};
		const updateResponse = await request(app)
			.put(`/api/chats/${chatId}`)
			.send(updatePayload);

		expect(updateResponse.status).toBe(200);
		expect(updateResponse.body.metadata.avatarUrl).toBe(
			"https://example.com/avatar.png"
		);

		const deleteResponse = await request(app).delete(`/api/chats/${chatId}`);
		expect(deleteResponse.status).toBe(204);

		const chatsAfterDelete = await ChatModel.countDocuments();
		expect(chatsAfterDelete).toBe(0);
	});

	it("creates and updates messages for a chat", async () => {
		const chat = await ChatModel.create({
			firstName: "Alan",
			lastName: "Turing",
		});

		const messagePayload = {
			text: "Hello there",
			authorName: "Alan",
		};

		const createMessageResponse = await request(app)
			.post(`/api/chats/${chat._id.toString()}/messages`)
			.send(messagePayload);

		expect(createMessageResponse.status).toBe(201);
		expect(createMessageResponse.body.text).toBe("Hello there");
		expect(scheduleAutoReplyMock).toHaveBeenCalledWith(chat._id.toString());

		const messageId = createMessageResponse.body._id;

		const updateMessageResponse = await request(app)
			.put(`/api/messages/${messageId}`)
			.send({ text: "Updated message" });

		expect(updateMessageResponse.status).toBe(200);
		expect(updateMessageResponse.body.text).toBe("Updated message");

		const storedMessage = await MessageModel.findById(messageId).lean();
		expect(storedMessage?.text).toBe("Updated message");
	});

	it("rejects invalid chat id when fetching messages", async () => {
		const response = await request(app).get("/api/chats/invalid-id/messages");

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Invalid chat id");
	});
});

describe("Auth endpoint", () => {
	beforeEach(() => {
		verifyIdTokenMock.mockReset();
	});

	it("returns error when token missing", async () => {
		const response = await request(app).post("/api/auth/google").send({});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
		expect(response.body.errors.fieldErrors.token).toBeDefined();
	});

	it("returns token and user data on success", async () => {
		verifyIdTokenMock.mockResolvedValue({
			getPayload: () => ({
				email: "user@example.com",
				sub: "google-123",
				name: "Test User",
				picture: "https://example.com/avatar.png",
			}),
		});

		const response = await request(app)
			.post("/api/auth/google")
			.send({ token: "fake-token" });

		expect(response.status).toBe(200);
		expect(response.body.token).toBeTypeOf("string");
		expect(response.body.user.email).toBe("user@example.com");

		const decoded = jwt.verify(
			response.body.token,
			env.jwtSecret
		) as jwt.JwtPayload;
		expect(decoded.email).toBe("user@example.com");

		const userCount = await UserModel.countDocuments();
		expect(userCount).toBe(1);
	});

	it("returns 400 for invalid google payload", async () => {
		verifyIdTokenMock.mockResolvedValue({
			getPayload: () => ({ email: null, sub: null }),
		});

		const response = await request(app)
			.post("/api/auth/google")
			.send({ token: "fake-token" });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Invalid Google token");
	});

	it("allows authentication with configured test token", async () => {
		const originalEnv = {
			token: process.env.GOOGLE_TEST_TOKEN,
			email: process.env.GOOGLE_TEST_USER_EMAIL,
			userId: process.env.GOOGLE_TEST_USER_ID,
			name: process.env.GOOGLE_TEST_USER_NAME,
			avatar: process.env.GOOGLE_TEST_USER_AVATAR,
		};

		process.env.GOOGLE_TEST_TOKEN = "test-token";
		process.env.GOOGLE_TEST_USER_EMAIL = "test.user@example.com";
		process.env.GOOGLE_TEST_USER_ID = "test-google-id";
		process.env.GOOGLE_TEST_USER_NAME = "Test User";
		process.env.GOOGLE_TEST_USER_AVATAR = "https://example.com/test-avatar.png";

		try {
			const response = await request(app)
				.post("/api/auth/google")
				.send({ token: "test-token" });

			expect(response.status).toBe(200);
			expect(response.body.user.email).toBe("test.user@example.com");
			expect(response.body.user.name).toBe("Test User");
			expect(verifyIdTokenMock).not.toHaveBeenCalled();
		} finally {
			process.env.GOOGLE_TEST_TOKEN = originalEnv.token;
			process.env.GOOGLE_TEST_USER_EMAIL = originalEnv.email;
			process.env.GOOGLE_TEST_USER_ID = originalEnv.userId;
			process.env.GOOGLE_TEST_USER_NAME = originalEnv.name;
			process.env.GOOGLE_TEST_USER_AVATAR = originalEnv.avatar;
		}
	});
});
