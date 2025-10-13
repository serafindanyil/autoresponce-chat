import { fetchQuote } from "@/services/quote.service";
import { createMessage } from "@/services/message.service";
import { emitMessageCreated } from "@/sockets/events";
import { logError } from "@/utils/logger";

export async function scheduleAutoReply(chatId: string): Promise<void> {
  setTimeout(async () => {
    try {
      const quote = await fetchQuote();
      const message = await createMessage({
        chatId,
        text: `${quote.content} — ${quote.author}`,
        authorName: "Quote Bot",
        isBot: true,
      });

      emitMessageCreated(message.toObject());
    } catch (error) {
      logError("Failed to send auto reply", { error, chatId });
    }
  }, 3000);
}
