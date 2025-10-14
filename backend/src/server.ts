import http from "http";
import { env } from "@/config/env";
import { connectMongo, disconnectMongo } from "@/lib/mongo";
import { createApp } from "./app";
import { createSocketServer } from "@/sockets";
import { seedDatabase } from "@/services/seed.service";
import { logError, logInfo } from "@/utils/logger";

async function bootstrap() {
	try {
		await connectMongo();
		await seedDatabase();

		const app = createApp();
		const server = http.createServer(app);
		createSocketServer(server);

		server.listen(env.port, () => {
			logInfo(`HTTP server ready at ${env.baseUrl}`);
		});

		process.on("SIGINT", async () => {
			await shutdown(server);
		});
		process.on("SIGTERM", async () => {
			await shutdown(server);
		});
	} catch (error) {
		logError("Failed to start server", { error });
		process.exit(1);
	}
}

async function shutdown(server: http.Server): Promise<void> {
	logInfo("Shutting down server");
	await new Promise<void>((resolve) => server.close(() => resolve()));
	await disconnectMongo();
	process.exit(0);
}

void bootstrap();
