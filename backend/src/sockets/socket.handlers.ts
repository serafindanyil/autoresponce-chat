import type { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { ClientEvents, ServerEvents, userRoom } from "@/sockets/events";
import {
	enableAutoBroadcast,
	disableAutoBroadcast,
	isAutoBroadcastEnabled,
} from "@/services/broadcast.service";
import { env } from "@/config/env";
import type { AuthenticatedUser } from "@/middlewares/auth.middleware";
import { sendChatBootstrap } from "@/services/chat-sync.service";

interface AuthenticatedSocket extends Socket {
	user?: AuthenticatedUser;
}

export function registerSocketHandlers(io: Server): void {
	io.use((socket, next) => {
		const authSocket = socket as AuthenticatedSocket;
		const rawToken =
			typeof socket.handshake.auth?.token === "string"
				? socket.handshake.auth?.token
				: socket.handshake.headers.authorization?.replace("Bearer ", "");

		if (!rawToken) {
			return next(new Error("Unauthorized"));
		}

		try {
			authSocket.user = jwt.verify(
				rawToken,
				env.jwtSecret
			) as AuthenticatedUser;
			return next();
		} catch (error) {
			return next(new Error("Unauthorized"));
		}
	});

	io.on("connection", async (socket: Socket) => {
		const authSocket = socket as AuthenticatedSocket;
		const user = authSocket.user;

		if (!user) {
			socket.disconnect(true);
			return;
		}

		socket.join(userRoom(user.id));
		await sendChatBootstrap(user.id);

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
