import ChatPage from "@/pages/chat/chat-page";
import WelcomeToChat from "@/pages/welcome-to-chat/welcome-to-chat";

const CHAT_MAPPER = {
	chat: ChatPage,
	start: WelcomeToChat,
};

export default function Home() {
	return <CHAT_MAPPER.start />;
}
