import type { Server } from "socket.io";
import type {
	ChatBootstrapItem,
	ChatPatchPayload,
} from "@/services/chat-sync.service";

let ioInstance: Server | undefined;

export enum ServerEvents {
	ChatsBootstrap = "chats:bootstrap",
	ChatPatch = "chats:patch",
	Notification = "notification",
}

export enum ClientEvents {
	ToggleAutoBot = "toggle:autoBot",
}

export function initSocket(server: Server): void {
	ioInstance = server;
}

function withIo(handler: (io: Server) => void): void {
	if (!ioInstance) {
		return;
	}

	handler(ioInstance);
}

export function emitChatsBootstrap(
	userId: string,
	data: ChatBootstrapItem[]
): void {
	withIo((io) =>
		io.to(userRoom(userId)).emit(ServerEvents.ChatsBootstrap, data)
	);
}

export function emitChatPatch(userId: string, payload: ChatPatchPayload): void {
	withIo((io) => io.to(userRoom(userId)).emit(ServerEvents.ChatPatch, payload));
}

export function emitNotification(payload: Record<string, unknown>): void {
	withIo((io) => io.emit(ServerEvents.Notification, payload));
}

export function userRoom(userId: string): string {
	return `user:${userId}`;
}
