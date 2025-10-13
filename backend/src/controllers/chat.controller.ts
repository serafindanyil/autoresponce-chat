import { Types } from "mongoose";
import type { Request, Response } from "express";
import * as chatService from "@/services/chat.service";
import * as messageService from "@/services/message.service";
import {
	emitChatCreated,
	emitChatDeleted,
	emitChatUpdated,
} from "@/sockets/events";

export async function getChats(_: Request, res: Response): Promise<void> {
	const chats = await chatService.listChats();
	res.json(chats);
}

export async function createChat(req: Request, res: Response): Promise<void> {
	const chatDoc = await chatService.createChat(req.body);
	const chat = chatDoc.toObject();
	emitChatCreated(chat);
	res.status(201).json(chat);
}

export async function updateChatHandler(
	req: Request,
	res: Response
): Promise<void> {
	const chat = await chatService.updateChat(req.params.chatId, req.body);

	if (!chat) {
		res.status(404).json({ message: "Chat not found" });
		return;
	}

	emitChatUpdated(chat);
	res.json(chat);
}

export async function deleteChatHandler(
	req: Request,
	res: Response
): Promise<void> {
	const chat = await chatService.deleteChat(req.params.chatId);

	if (!chat) {
		res.status(404).json({ message: "Chat not found" });
		return;
	}

	emitChatDeleted(chat._id.toString());
	res.status(204).send();
}

export async function getChatMessages(
	req: Request,
	res: Response
): Promise<void> {
	if (!Types.ObjectId.isValid(req.params.chatId)) {
		res.status(400).json({ message: "Invalid chat id" });
		return;
	}

	const messages = await messageService.listMessages(req.params.chatId);
	res.json(messages);
}
