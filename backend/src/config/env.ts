import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path:
		process.env.NODE_ENV === "test"
			? ".env.test"
			: path.resolve(process.cwd(), ".env"),
});

const requiredEnv = ["MONGODB_URI"] as const;

for (const key of requiredEnv) {
	if (!process.env[key]) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
}

export const env = {
	port: Number(process.env.PORT ?? 4000),
	mongoUri: process.env.MONGODB_URI as string,
};
