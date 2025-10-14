"use client";

import ChatHeader from "@/modules/chat-header/chat-header";
import ChatList from "@/modules/chat-list/chat-list";
import ChatSendMessage from "@/modules/chat-send-message/chat-send-message";

type ChatProps = {
	chatId: string;
};

const Chat = ({ chatId }: ChatProps) => {
	return (
		<div className="flex flex-col h-full w-full min-w-0">
			<ChatHeader chatId={chatId} />
			<ChatList chatId={chatId} />
			<ChatSendMessage chatId={chatId} />
		</div>
	);
};

export default Chat;
