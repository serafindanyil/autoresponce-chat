import ChatPage from "@/pages/chat/chat-page";
import ProtectedRoute from "@/components/protected-route/protected-route";

export default function Chat() {
	return (
		<ProtectedRoute>
			<ChatPage />
		</ProtectedRoute>
	);
}
