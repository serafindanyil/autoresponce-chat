import ChatHeader from "@/modules/chat-header/chat-header";
import ChatList from "@/modules/chat-list/chat-list";
import ChatSendMessage from "@/modules/chat-send-message/chat-send-message";

const Chat = () => {
	return (
		<div className="flex flex-col h-full w-full min-w-0">
			<ChatHeader />
			<ChatList />
			<ChatSendMessage />
		</div>
	);
};

export default Chat;
