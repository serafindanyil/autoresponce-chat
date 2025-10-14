import Button from "@/ui/button/button";
import { Plus } from "lucide-react";

const ButtonNewChat = () => {
	return (
		<Button state="transparent" size="sm">
			<Plus size={16} />
			<p>New Chat</p>
		</Button>
	);
};

export default ButtonNewChat;
