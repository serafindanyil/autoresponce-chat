import { Router } from "express";
import { z } from "zod";
import {
	createChat,
	deleteChatHandler,
	getChats,
	getChatMessages,
	updateChatHandler,
} from "@/controllers/chat.controller";
import { createMessageHandler } from "@/controllers/message.controller";
import { validateBody } from "@/middlewares/validation.middleware";

const router = Router();

const chatBodySchema = z.object({
	firstName: z.string().min(1).max(100),
	lastName: z.string().min(1).max(100),
	metadata: z
		.object({
			avatarUrl: z.string().url().optional(),
		})
		.optional(),
});

const messageBodySchema = z.object({
	text: z.string().min(1).max(2000),
	authorName: z.string().min(1).max(120),
	authorUserId: z.string().optional(),
	isBot: z.boolean().optional(),
});

router.get("/", getChats);
router.post("/", validateBody(chatBodySchema), createChat);
router.put(
	"/:chatId",
	validateBody(chatBodySchema.partial()),
	updateChatHandler
);
router.delete("/:chatId", deleteChatHandler);

router.get("/:chatId/messages", getChatMessages);
router.post(
	"/:chatId/messages",
	validateBody(messageBodySchema),
	createMessageHandler
);

export const chatRoutes = router;
