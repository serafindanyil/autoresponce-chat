import ProtectedRoute from "@/components/protected-route/protected-route";
import WelcomeToChat from "@/pages/welcome-to-chat/welcome-to-chat";

export default function Home() {
	return (
		<ProtectedRoute>
			<WelcomeToChat />
		</ProtectedRoute>
	);
}
