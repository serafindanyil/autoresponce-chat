import { Router } from "express";
import { z } from "zod";
import {
	deleteChatHandler,
	updateChatHandler,
} from "@/controllers/chat.controller";
import { createMessageHandler } from "@/controllers/message.controller";
import { validateBody } from "@/middlewares/validation.middleware";
import { verifyJwt } from "@/middlewares/auth.middleware";

const router = Router();

const messageBodySchema = z.object({
	text: z.string().min(1).max(2000),
});

const updateChatSchema = z
	.object({
		firstName: z.string().min(1).max(100).optional(),
		lastName: z.string().min(1).max(100).optional(),
		metadata: z
			.object({
				avatarUrl: z.string().url().optional(),
			})
			.optional(),
	})
	.refine((value) => Object.keys(value).length > 0, {
		message: "At least one field must be provided",
	});

router.use(verifyJwt);
router.put(":chatId", validateBody(updateChatSchema), updateChatHandler);
router.delete(":chatId", deleteChatHandler);
router.post(
	"/:chatId/messages",
	validateBody(messageBodySchema),
	createMessageHandler
);

export const chatRoutes = router;
