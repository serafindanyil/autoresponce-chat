import type { Express, Request, Response } from "express";
import { Router } from "express";
import { getTestMessage } from "@/controllers/test.controller";

const apiRouter = Router();

apiRouter.get("/test", getTestMessage);

export function registerRoutes(app: Express): void {
	app.use("/api", apiRouter);

	app.get("/health", (_: Request, res: Response) => {
		res.json({ status: "healthy" });
	});
}
