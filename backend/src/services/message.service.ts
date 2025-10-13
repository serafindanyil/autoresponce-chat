import { Types } from "mongoose";
import { MessageModel, type MessageLean, type MessageDocument } from "@/models";

export interface CreateMessageInput {
	readonly chatId: string;
	readonly text: string;
	readonly authorName: string;
	readonly authorUserId?: string;
	readonly isBot?: boolean;
}

export interface UpdateMessageInput {
	readonly text: string;
}

export async function listMessages(chatId: string): Promise<MessageLean[]> {
	return MessageModel.find({ chatId: new Types.ObjectId(chatId) })
		.sort({ createdAt: 1 })
		.lean();
}

export async function listMessagesForChats(
	chatIds: Types.ObjectId[]
): Promise<Record<string, MessageLean[]>> {
	const messages = await MessageModel.find({ chatId: { $in: chatIds } })
		.sort({ createdAt: 1 })
		.lean();

	return messages.reduce<Record<string, MessageLean[]>>((acc, message) => {
		const key = message.chatId.toString();
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(message);
		return acc;
	}, {});
}

export async function createMessage(
	input: CreateMessageInput
): Promise<MessageDocument> {
	const { chatId, text, authorName, authorUserId, isBot } = input;

	return MessageModel.create({
		chatId: new Types.ObjectId(chatId),
		text,
		author: {
			name: authorName,
			isBot: Boolean(isBot),
			userId:
				authorUserId && Types.ObjectId.isValid(authorUserId)
					? new Types.ObjectId(authorUserId)
					: undefined,
		},
	});
}

export async function updateMessage(
	messageId: string,
	updates: UpdateMessageInput
): Promise<MessageLean | null> {
	return MessageModel.findByIdAndUpdate(
		messageId,
		{ text: updates.text },
		{ new: true, runValidators: true }
	).lean();
}
