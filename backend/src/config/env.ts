import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path:
		process.env.NODE_ENV === "test"
			? ".env.test"
			: path.resolve(process.cwd(), ".env"),
});

function getEnvValue(key: string): string | undefined {
	const value = process.env[key];
	return value?.trim() ? value : undefined;
}

function requireEnv(key: string): string {
	const value = getEnvValue(key);
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}

export const env = {
	get port(): number {
		return Number(process.env.PORT ?? 4000);
	},
	get mongoUri(): string {
		return requireEnv("MONGODB_URI");
	},
	get jwtSecret(): string {
		return requireEnv("JWT_SECRET");
	},
	get googleClientId(): string | undefined {
		return getEnvValue("GOOGLE_CLIENT_ID");
	},
	get googleClientSecret(): string | undefined {
		return getEnvValue("GOOGLE_CLIENT_SECRET");
	},
	get googleTestToken(): string | undefined {
		return getEnvValue("GOOGLE_TEST_TOKEN");
	},
	get googleTestUserEmail(): string | undefined {
		return getEnvValue("GOOGLE_TEST_USER_EMAIL");
	},
	get googleTestUserId(): string | undefined {
		return getEnvValue("GOOGLE_TEST_USER_ID");
	},
	get googleTestUserName(): string | undefined {
		return getEnvValue("GOOGLE_TEST_USER_NAME");
	},
	get googleTestUserAvatar(): string | undefined {
		return getEnvValue("GOOGLE_TEST_USER_AVATAR");
	},
	get frontendUrl(): string {
		return getEnvValue("FRONTEND_URL") ?? "http://localhost:3000";
	},
	get baseUrl(): string {
		return (
			getEnvValue("BASE_URL") ?? `http://localhost:${process.env.PORT ?? 4000}`
		);
	},
	get broadcastIntervalMs(): number {
		return Number(process.env.BROADCAST_INTERVAL_MS ?? 15000);
	},
};
