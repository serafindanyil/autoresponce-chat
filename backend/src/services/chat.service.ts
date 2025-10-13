import { Types, type FilterQuery } from "mongoose";
import { ChatModel, type ChatDocument, type ChatLean } from "@/models";

export interface CreateChatInput {
	readonly ownerId: Types.ObjectId;
	readonly firstName: string;
	readonly lastName: string;
	readonly metadata?: { readonly avatarUrl?: string };
}

export interface UpdateChatInput {
	readonly firstName?: string;
	readonly lastName?: string;
	readonly metadata?: { readonly avatarUrl?: string };
}

export async function listChats(
	filter: FilterQuery<ChatDocument> = {}
): Promise<ChatLean[]> {
	return ChatModel.find(filter).sort({ updatedAt: -1 }).lean();
}

export async function getChatById(chatId: string): Promise<ChatLean | null> {
	return ChatModel.findById(chatId).lean();
}

export async function getChatOwnedBy(
	chatId: string,
	ownerId: Types.ObjectId
): Promise<ChatLean | null> {
	return ChatModel.findOne({ _id: chatId, ownerId }).lean();
}

export async function createChat(
	input: CreateChatInput
): Promise<ChatDocument> {
	return ChatModel.create(input);
}

export async function updateChat(
	chatId: string,
	updates: UpdateChatInput
): Promise<ChatLean | null> {
	return ChatModel.findByIdAndUpdate(chatId, updates, {
		new: true,
		runValidators: true,
	}).lean();
}

export async function deleteChat(chatId: string): Promise<ChatLean | null> {
	return ChatModel.findByIdAndDelete(chatId).lean();
}

export async function listChatsByOwner(
	ownerId: Types.ObjectId
): Promise<ChatLean[]> {
	return ChatModel.find({ ownerId }).sort({ updatedAt: -1 }).lean();
}

export async function ensureDefaultChats(
	ownerId: Types.ObjectId
): Promise<void> {
	const existingCount = await ChatModel.countDocuments({ ownerId });
	if (existingCount > 0) {
		return;
	}

	const defaults: Array<Omit<CreateChatInput, "ownerId">> = [
		{ firstName: "Ada", lastName: "Lovelace" },
		{ firstName: "Alan", lastName: "Turing" },
		{ firstName: "Grace", lastName: "Hopper" },
	];

	await ChatModel.insertMany(defaults.map((chat) => ({ ...chat, ownerId })));
}
