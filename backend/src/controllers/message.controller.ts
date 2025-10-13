import { Types } from "mongoose";
import type { Request, Response } from "express";
import * as messageService from "@/services/message.service";
import * as chatService from "@/services/chat.service";
import { MessageModel } from "@/models";
import { sendChatPatch } from "@/services/chat-sync.service";
import { scheduleAutoReply } from "@/services/auto-reply.service";

export async function createMessageHandler(
	req: Request,
	res: Response
): Promise<void> {
	if (!req.user) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const { chatId } = req.params;

	if (!Types.ObjectId.isValid(chatId)) {
		res.status(400).json({ message: "Invalid chat id" });
		return;
	}

	const ownerId = new Types.ObjectId(req.user.id);
	const chat = await chatService.getChatOwnedBy(chatId, ownerId);

	if (!chat) {
		res.status(404).json({ message: "Chat not found" });
		return;
	}

	const messageDoc = await messageService.createMessage({
		chatId,
		text: req.body.text,
		authorName: req.user.name,
		authorUserId: req.user.id,
	});

	if (!req.body.isBot) {
		void scheduleAutoReply(chatId, req.user.id);
	}

	await sendChatPatch(req.user.id, chatId);
	res.status(201).json(messageDoc.toObject());
}

export async function updateMessageHandler(
	req: Request,
	res: Response
): Promise<void> {
	if (!req.user) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const { messageId } = req.params;

	if (!Types.ObjectId.isValid(messageId)) {
		res.status(400).json({ message: "Invalid message id" });
		return;
	}

	const messageDoc = await MessageModel.findById(messageId).lean();

	if (!messageDoc) {
		res.status(404).json({ message: "Message not found" });
		return;
	}

	const ownerId = new Types.ObjectId(req.user.id);
	const chat = await chatService.getChatOwnedBy(
		messageDoc.chatId.toString(),
		ownerId
	);

	if (!chat) {
		res.status(404).json({ message: "Chat not found" });
		return;
	}

	const message = await messageService.updateMessage(messageId, req.body);

	if (!message) {
		res.status(404).json({ message: "Message not found" });
		return;
	}
	await sendChatPatch(req.user.id, messageDoc.chatId.toString());
	res.json(message);
}
