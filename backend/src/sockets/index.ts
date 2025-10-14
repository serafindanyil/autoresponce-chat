import type { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { initSocket } from "@/sockets/events";
import { registerSocketHandlers } from "@/sockets/socket.handlers";
import { env } from "@/config/env";

export function createSocketServer(httpServer: Server): SocketIOServer {
	const allowedOrigins = [env.frontendUrl, "https://*.onrender.com"];

	if (process.env.NODE_ENV === "development") {
		allowedOrigins.push("http://localhost:3000");
	}
	const io = new SocketIOServer(httpServer, {
		cors: {
			origin: allowedOrigins,
			credentials: true,
		},
	});

	initSocket(io);
	registerSocketHandlers(io);

	return io;
}
