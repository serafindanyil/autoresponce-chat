import type { Express } from "express";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { registerRoutes } from "@/routes";

export function createApp(): Express {
	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use(morgan("dev"));

	registerRoutes(app);

	return app;
}
