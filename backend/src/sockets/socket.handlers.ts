import type { Server, Socket } from "socket.io";
import { ClientEvents, ServerEvents } from "@/sockets/events";
import { enableAutoBroadcast, disableAutoBroadcast, isAutoBroadcastEnabled } from "@/services/broadcast.service";

export function registerSocketHandlers(io: Server): void {
  io.on("connection", (socket: Socket) => {
    socket.on(ClientEvents.JoinChat, (chatId: string) => {
      socket.join(chatId);
    });

    socket.on(ClientEvents.LeaveChat, (chatId: string) => {
      socket.leave(chatId);
    });

    socket.on(ClientEvents.ToggleAutoBot, (flag: boolean) => {
      if (flag) {
        enableAutoBroadcast();
      } else {
        disableAutoBroadcast();
      }

      io.emit(ServerEvents.Notification, {
        type: "bot-toggle",
        enabled: isAutoBroadcastEnabled(),
      });
    });
  });
}
