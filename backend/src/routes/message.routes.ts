import { Router } from "express";
import { z } from "zod";
import { updateMessageHandler } from "@/controllers/message.controller";
import { validateBody } from "@/middlewares/validation.middleware";

const router = Router();

const updateMessageSchema = z.object({
	text: z.string().min(1).max(2000),
});

router.put(
	"/:messageId",
	validateBody(updateMessageSchema),
	updateMessageHandler
);

export const messageRoutes = router;
