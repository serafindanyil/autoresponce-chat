import type { FilterQuery } from "mongoose";
import { ChatModel, type ChatDocument, type ChatLean } from "@/models";

export interface CreateChatInput {
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

export async function seedChats(samples: CreateChatInput[]): Promise<number> {
	const existing = await ChatModel.countDocuments();

	if (existing > 0) {
		return existing;
	}

	await ChatModel.insertMany(samples);

	return ChatModel.countDocuments();
}
