import type { Express } from "express";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { registerRoutes } from "@/routes";
import { env } from "@/config/env";
import { errorHandler, notFoundHandler } from "@/middlewares/error.middleware";

export function createApp(): Express {
	const app = express();

	app.use(
		cors({
			origin: env.frontendUrl,
			credentials: true,
		}),
	);
	app.use(helmet());
	app.use(cookieParser());
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true }));
	app.use(morgan("dev"));

	registerRoutes(app);

	app.use(notFoundHandler);
	app.use(errorHandler);

	return app;
}
