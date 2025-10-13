import type { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { initSocket } from "@/sockets/events";
import { registerSocketHandlers } from "@/sockets/socket.handlers";
import { env } from "@/config/env";

export function createSocketServer(httpServer: Server): SocketIOServer {
	const io = new SocketIOServer(httpServer, {
		cors: {
			origin: env.frontendUrl,
			credentials: true,
		},
	});

	initSocket(io);
	registerSocketHandlers(io);

	return io;
}
