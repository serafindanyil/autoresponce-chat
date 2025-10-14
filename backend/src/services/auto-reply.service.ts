import { fetchQuote } from "@/services/quote.service";
import { createMessage } from "@/services/message.service";
import { logError } from "@/utils/logger";
import { sendChatPatch } from "@/services/chat-sync.service";

export async function scheduleAutoReply(
	chatId: string,
	ownerUserId: string
): Promise<void> {
	setTimeout(async () => {
		try {
			const quote = await fetchQuote();
			await createMessage({
				chatId,
				text: `${quote.content} — ${quote.author}`,
				authorName: "Quote Bot",
				isBot: true,
			});

			await sendChatPatch(ownerUserId, chatId);
		} catch (error) {
			logError("Failed to send auto reply", { error, chatId });
		}
	}, 3000);
}
