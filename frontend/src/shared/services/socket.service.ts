import { io, Socket } from "socket.io-client";
import type { ChatPatchEvent, ChatWithMessages } from "@/shared/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export type SocketEventHandlers = {
	onBootstrap: (data: ChatWithMessages[]) => void;
	onPatch: (data: ChatPatchEvent) => void;
	onNotification: (data: unknown) => void;
	onConnect: () => void;
	onDisconnect: () => void;
};

export class SocketService {
	private socket: Socket | null = null;
	private handlers: SocketEventHandlers | null = null;

	connect(token: string, handlers: SocketEventHandlers): void {
		if (this.socket?.connected) {
			return;
		}

		this.handlers = handlers;
		this.socket = io(BASE_URL, {
			auth: { token },
		});

		this.setupListeners();
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
			this.handlers = null;
		}
	}

	toggleAutoBot(enabled: boolean): void {
		if (this.socket?.connected) {
			this.socket.emit("toggle:autoBot", enabled);
		}
	}

	isConnected(): boolean {
		return this.socket?.connected ?? false;
	}

	private setupListeners(): void {
		if (!this.socket || !this.handlers) {
			return;
		}

		this.socket.on("connect", () => {
			this.handlers?.onConnect();
		});

		this.socket.on("disconnect", () => {
			this.handlers?.onDisconnect();
		});

		this.socket.on("chats:bootstrap", (data: ChatWithMessages[]) => {
			this.handlers?.onBootstrap(data);
		});

		this.socket.on("chats:patch", (data: ChatPatchEvent) => {
			this.handlers?.onPatch(data);
		});

		this.socket.on("notification", (data: unknown) => {
			this.handlers?.onNotification(data);
		});
	}
}

export const socketService = new SocketService();
