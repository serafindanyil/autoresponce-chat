import type { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { Request } from "express";
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

  io.use((socket, next) => {
    const request = socket.request as Request;
    // Future: verify JWT if needed from request headers or cookies
    void request;
    next();
  });

  initSocket(io);
  registerSocketHandlers(io);

  return io;
}
