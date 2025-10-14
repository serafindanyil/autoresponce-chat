import { Types } from "mongoose";
import type { Request, Response } from "express";
import * as chatService from "@/services/chat.service";
import { sendChatPatch } from "@/services/chat-sync.service";

export async function createChatHandler(
	req: Request,
	res: Response
): Promise<void> {
	if (!req.user) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const ownerId = new Types.ObjectId(req.user.id);

	const chat = await chatService.createChat({
		ownerId,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		metadata: req.body.metadata,
	});

	await sendChatPatch(req.user.id, chat._id.toString());
	res.status(201).json(chat.toObject());
}

export async function updateChatHandler(
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

	const updated = await chatService.updateChat(chatId, req.body);

	if (!updated) {
		res.status(404).json({ message: "Chat not found" });
		return;
	}

	await sendChatPatch(req.user.id, chatId);
	res.json(updated);
}

export async function deleteChatHandler(
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

	await chatService.deleteChat(chatId);
	await sendChatPatch(req.user.id, chatId, { removed: true });
	res.status(204).send();
}
