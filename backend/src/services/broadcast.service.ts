import { env } from "@/config/env";
import { fetchQuote } from "@/services/quote.service";
import { ChatModel } from "@/models";
import { createMessage } from "@/services/message.service";
import { emitMessageCreated } from "@/sockets/events";
import { logInfo, logError } from "@/utils/logger";

let timer: NodeJS.Timeout | null = null;
let enabled = false;

export function enableAutoBroadcast(): void {
  if (enabled) {
    return;
  }

  enabled = true;
  scheduleNext();
}

export function disableAutoBroadcast(): void {
  enabled = false;

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

export function isAutoBroadcastEnabled(): boolean {
  return enabled;
}

async function performBroadcast() {
  try {
    const count = await ChatModel.countDocuments();

    if (count === 0) {
      return;
    }

    const randomOffset = Math.floor(Math.random() * count);
    const randomChat = await ChatModel.findOne().skip(randomOffset).lean();

    if (!randomChat) {
      return;
    }

    const quote = await fetchQuote();

    const message = await createMessage({
      chatId: randomChat._id.toString(),
      text: `${quote.content} — ${quote.author}`,
      authorName: "Auto Bot",
      isBot: true,
    });

    emitMessageCreated(message.toObject());
    logInfo("Broadcast message sent", { chatId: randomChat._id });
  } catch (error) {
    logError("Failed to broadcast message", { error });
  }
}

function scheduleNext() {
  if (!enabled) {
    return;
  }

  timer = setTimeout(async () => {
    await performBroadcast();
    scheduleNext();
  }, env.broadcastIntervalMs);
}
