import { Types, type FilterQuery } from "mongoose";
import { ChatModel, type ChatDocument, type ChatLean } from "@/models";
import { createMessage } from "@/services/message.service";

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

	const defaults: Array<
		Omit<CreateChatInput, "ownerId"> & { readonly welcome: string }
	> = [
		{
			firstName: "Ada",
			lastName: "Lovelace",
			welcome: "Привіт! Я Ада. Розкажи, над чим працюєш?",
		},
		{
			firstName: "Alan",
			lastName: "Turing",
			welcome: "Радий знайомству! Як просувається твій сьогоднішній спринт?",
		},
		{
			firstName: "Grace",
			lastName: "Hopper",
			welcome: "Вітаю! Поділишся, яку багу щойно перемогла?",
		},
	];

	const createdChats = await ChatModel.insertMany(
		defaults.map(({ welcome, ...chat }) => ({ ...chat, ownerId }))
	);

	await Promise.all(
		createdChats.map((chatDoc, index) =>
			createMessage({
				chatId: chatDoc._id.toString(),
				text: defaults[index].welcome,
				authorName: `${defaults[index].firstName} ${defaults[index].lastName}`,
				isBot: true,
			})
		)
	);
}
