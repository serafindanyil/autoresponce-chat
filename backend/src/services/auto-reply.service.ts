import { fetchQuote } from "@/services/quote.service";
import { createMessage } from "@/services/message.service";
import { logError, logInfo } from "@/utils/logger";
import { sendChatPatch } from "@/services/chat-sync.service";
import { ChatModel } from "@/models";
import { Types } from "mongoose";

export async function scheduleAutoReply(
	chatId: string,
	ownerUserId: string
): Promise<void> {
	setTimeout(async () => {
		try {
			const chat = await ChatModel.findById(new Types.ObjectId(chatId)).lean();

			if (!chat) {
				logError("Chat not found for auto-reply", { chatId });
				return;
			}

			const quote = await fetchQuote();
			const authorName = `${chat.firstName} ${chat.lastName}`;

			await createMessage({
				chatId,
				text: `${quote.content} — ${quote.author}`,
				authorName,
				isBot: true,
			});

			await sendChatPatch(ownerUserId, chatId);

			logInfo("Auto-reply sent", { chatId, authorName });
		} catch (error) {
			logError("Failed to send auto reply", { error, chatId });
		}
	}, 3000);
}
