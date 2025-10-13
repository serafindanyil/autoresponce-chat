import type { Express, Request, Response } from "express";
import { Router } from "express";
import { chatRoutes } from "@/routes/chat.routes";
import { messageRoutes } from "@/routes/message.routes";
import { authRoutes } from "@/routes/auth.routes";
import { getTestMessage } from "@/controllers/test.controller";

const apiRouter = Router();

apiRouter.get("/test", getTestMessage);
apiRouter.use("/chats", chatRoutes);
apiRouter.use("/messages", messageRoutes);
apiRouter.use("/auth", authRoutes);

export function registerRoutes(app: Express): void {
	app.use("/api", apiRouter);

	app.get("/health", (_: Request, res: Response) => {
		res.json({ status: "healthy" });
	});
}
