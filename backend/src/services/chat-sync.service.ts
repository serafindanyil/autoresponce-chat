import { Types } from "mongoose";
import type { ChatLean, MessageLean } from "@/models";
import { getChatOwnedBy, listChatsByOwner } from "@/services/chat.service";
import { listMessages, listMessagesForChats } from "@/services/message.service";
import { emitChatPatch, emitChatsBootstrap } from "@/sockets/events";

export interface ChatBootstrapItem {
	readonly chat: ChatLean;
	readonly messages: MessageLean[];
}

export interface ChatPatchPayload {
	readonly chatId: string;
	readonly chat?: ChatLean;
	readonly messages?: MessageLean[];
	readonly removed?: boolean;
}

export async function sendChatBootstrap(userId: string): Promise<void> {
	const ownerId = new Types.ObjectId(userId);
	const chats = await listChatsByOwner(ownerId);

	if (chats.length === 0) {
		emitChatsBootstrap(userId, []);
		return;
	}

	const messagesByChat = await listMessagesForChats(
		chats.map((chat) => chat._id)
	);

	const payload: ChatBootstrapItem[] = chats.map((chat) => ({
		chat,
		messages: messagesByChat[chat._id.toString()] ?? [],
	}));

	emitChatsBootstrap(userId, payload);
}

export async function sendChatPatch(
	userId: string,
	chatId: string,
	options: { readonly removed?: boolean } = {}
): Promise<void> {
	if (options.removed) {
		emitChatPatch(userId, { chatId, removed: true });
		return;
	}

	const ownerId = new Types.ObjectId(userId);
	const chat = await getChatOwnedBy(chatId, ownerId);

	if (!chat) {
		emitChatPatch(userId, { chatId, removed: true });
		return;
	}

	const messages = await listMessages(chatId);
	const payload: ChatPatchPayload = {
		chatId: chat._id.toString(),
		chat,
		messages,
	};

	emitChatPatch(userId, payload);
}
