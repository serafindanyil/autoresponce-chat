import { Types } from "mongoose";
import type { Server } from "socket.io";
import type {
	ChatDocument,
	ChatLean,
	MessageDocument,
	MessageLean,
} from "@/models";

let ioInstance: Server | undefined;

export enum ServerEvents {
	MessageNew = "message:new",
	MessageEdited = "message:edited",
	ChatCreated = "chat:created",
	ChatUpdated = "chat:updated",
	ChatDeleted = "chat:deleted",
	Notification = "notification",
}

export enum ClientEvents {
	JoinChat = "join:chat",
	LeaveChat = "leave:chat",
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

export function emitChatCreated(chat: ChatLean | ChatDocument): void {
	withIo((io) => io.emit(ServerEvents.ChatCreated, chat));
}

export function emitChatUpdated(chat: ChatLean | ChatDocument): void {
	withIo((io) => io.emit(ServerEvents.ChatUpdated, chat));
}

export function emitChatDeleted(chatId: string): void {
	withIo((io) => io.emit(ServerEvents.ChatDeleted, { chatId }));
}

export function emitMessageCreated(
	message: MessageLean | MessageDocument
): void {
	withIo((io) =>
		io.to(stringifyId(message.chatId)).emit(ServerEvents.MessageNew, message)
	);
}

export function emitMessageEdited(
	message: MessageLean | MessageDocument
): void {
	withIo((io) =>
		io.to(stringifyId(message.chatId)).emit(ServerEvents.MessageEdited, message)
	);
}

export function emitNotification(payload: Record<string, unknown>): void {
	withIo((io) => io.emit(ServerEvents.Notification, payload));
}

function stringifyId(id: Types.ObjectId | string): string {
	return typeof id === "string" ? id : id.toString();
}
