import { beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
	process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-jwt-secret";
	process.env.GOOGLE_CLIENT_ID =
		process.env.GOOGLE_CLIENT_ID ?? "test-google-client-id";
	process.env.GOOGLE_CLIENT_SECRET =
		process.env.GOOGLE_CLIENT_SECRET ?? "test-google-client-secret";
	process.env.FRONTEND_URL =
		process.env.FRONTEND_URL ?? "http://localhost:3000";

	mongoServer = await MongoMemoryServer.create();
	process.env.MONGODB_URI = mongoServer.getUri();

	const { connectMongo } = await import("@/lib/mongo");
	await connectMongo();
});

afterEach(async () => {
	if (mongoose.connection.readyState !== 1) {
		return;
	}

	const collections = await mongoose.connection.db.collections();
	await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});
