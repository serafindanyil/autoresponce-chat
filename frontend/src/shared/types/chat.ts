export type ChatMetadata = {
	avatarUrl?: string | null;
};

export type Chat = {
	_id: string;
	ownerId: string;
	firstName: string;
	lastName: string;
	metadata: ChatMetadata;
	createdAt: string;
	updatedAt: string;
};

export type MessageAuthor = {
	name: string;
	userId: string | null;
	isBot: boolean;
};

export type Message = {
	_id: string;
	chatId: string;
	text: string;
	author: MessageAuthor;
	createdAt: string;
	updatedAt: string;
};

export type ChatWithMessages = {
	chat: Chat;
	messages: Message[];
};

export type CreateChatRequest = {
	firstName: string;
	lastName: string;
	metadata?: ChatMetadata;
};

export type UpdateChatRequest = Partial<CreateChatRequest>;

export type CreateMessageRequest = {
	text: string;
};

export type UpdateMessageRequest = {
	text: string;
};

export type ChatPatchEvent = {
	chatId: string;
	chat?: Chat;
	messages?: Message[];
	removed?: boolean;
};

export type MessagePatchEvent = {
	chatId: string;
	messageId: string;
	removed: boolean;
};

export type ChatState = {
	chats: Record<string, Chat>;
	messages: Record<string, Message[]>;
	isConnected: boolean;
};
