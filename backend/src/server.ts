import { env } from "@/config/env";
import { connectMongo } from "@/lib/mongo";
import { createApp } from "./app";

async function bootstrap() {
	try {
		await connectMongo();
		const app = createApp();

		app.listen(env.port, () => {
			console.log(`HTTP server ready at http://localhost:${env.port}`);
		});
	} catch (error) {
		console.error("Failed to start server", error);
		process.exit(1);
	}
}

void bootstrap();
