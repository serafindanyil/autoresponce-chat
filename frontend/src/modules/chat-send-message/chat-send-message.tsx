import Box from "@/ui/box/box";
import Input from "@/ui/input/input";
import Button from "@/ui/button/button";

import { Search } from "lucide-react";

const ChatSendMessage = () => {
	return (
		<header className="w-full">
			<Box className="flex w-full items-stretch gap-2 bg-muted/30">
				<Input placeholder="Type your message..." className="w-full" />
				<Button size="md" state="active" className="">
					<Search size={18} />
				</Button>
			</Box>
		</header>
	);
};

export default ChatSendMessage;
