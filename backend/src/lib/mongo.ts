import mongoose from "mongoose";
import { env } from "@/config/env";

const connectionState = {
	isConnected: false,
};

export async function connectMongo(): Promise<typeof mongoose> {
	if (connectionState.isConnected) {
		return mongoose;
	}

	mongoose.connection.on("connected", () => {
		connectionState.isConnected = true;
		console.log("MongoDB connected");
	});

	mongoose.connection.on("disconnected", () => {
		connectionState.isConnected = false;
		console.log("MongoDB disconnected");
	});

	mongoose.connection.on("error", (error) => {
		console.error("MongoDB connection error", error);
	});

	return mongoose.connect(env.mongoUri);
}

export async function disconnectMongo(): Promise<void> {
	if (!connectionState.isConnected) {
		return;
	}

	await mongoose.disconnect();
}
