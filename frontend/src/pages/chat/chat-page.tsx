"use client";

import { useParams } from "next/navigation";
import Chat from "@/modules/chat/chat";

const ChatPage = () => {
	const params = useParams();
	const chatId = params?.chatID as string;

	if (!chatId) {
		return <div>Chat not found</div>;
	}

	return (
		<div className="flex h-full min-h-full w-full min-w-0">
			<Chat chatId={chatId} />
		</div>
	);
};

export default ChatPage;
