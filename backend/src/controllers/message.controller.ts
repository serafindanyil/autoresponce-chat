import { Types } from "mongoose";
import type { Request, Response } from "express";
import * as messageService from "@/services/message.service";
import { emitMessageCreated, emitMessageEdited } from "@/sockets/events";
import { scheduleAutoReply } from "@/services/auto-reply.service";

export async function createMessageHandler(
	req: Request,
	res: Response
): Promise<void> {
	const { chatId } = req.params;

	if (!Types.ObjectId.isValid(chatId)) {
		res.status(400).json({ message: "Invalid chat id" });
		return;
	}

	if (req.body.authorUserId && !Types.ObjectId.isValid(req.body.authorUserId)) {
		res.status(400).json({ message: "Invalid author user id" });
		return;
	}

	const messageDoc = await messageService.createMessage({
		chatId,
		text: req.body.text,
		authorName: req.body.authorName,
		authorUserId: req.body.authorUserId,
		isBot: req.body.isBot,
	});

	const message = messageDoc.toObject();

	emitMessageCreated(message);

	if (!req.body.isBot) {
		void scheduleAutoReply(chatId);
	}

	res.status(201).json(message);
}

export async function updateMessageHandler(
	req: Request,
	res: Response
): Promise<void> {
	const { messageId } = req.params;

	if (!Types.ObjectId.isValid(messageId)) {
		res.status(400).json({ message: "Invalid message id" });
		return;
	}

	const message = await messageService.updateMessage(messageId, req.body);

	if (!message) {
		res.status(404).json({ message: "Message not found" });
		return;
	}

	emitMessageEdited(message);

	res.json(message);
}
