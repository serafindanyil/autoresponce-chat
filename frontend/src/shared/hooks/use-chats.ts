import { useSelector } from "react-redux";
import type { RootState } from "@/shared/store";

export const useChats = () => {
	const chats = useSelector((state: RootState) => state.chat.chats);
	const messages = useSelector((state: RootState) => state.chat.messages);
	const isConnected = useSelector((state: RootState) => state.chat.isConnected);

	const chatsList = Object.values(chats);
	
	const getChatMessages = (chatId: string) => messages[chatId] || [];
	
	const getChat = (chatId: string) => chats[chatId];

	return {
		chats: chatsList,
		messages,
		isConnected,
		getChatMessages,
		getChat,
	};
};
