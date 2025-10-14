"use client";

import { useState } from "react";
import Box from "@/ui/box/box";
import Input from "@/ui/input/input";
import Button from "@/ui/button/button";
import { Send } from "lucide-react";
import { useCreateMessageMutation } from "@/shared/services/api.service";

type ChatSendMessageProps = {
	chatId: string;
};

const ChatSendMessage = ({ chatId }: ChatSendMessageProps) => {
	const [message, setMessage] = useState("");
	const [createMessage, { isLoading }] = useCreateMessageMutation();

	const handleSend = async () => {
		if (!message.trim()) return;

		try {
			await createMessage({
				chatId,
				data: { text: message },
			}).unwrap();
			setMessage("");
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<header className="w-full">
			<Box className="flex w-full items-stretch gap-2 bg-muted/30 border-t border-b-0">
				<Input
					placeholder="Type your message..."
					className="w-full"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyPress={handleKeyPress}
					disabled={isLoading}
				/>
				<Button
					size="md"
					state="active"
					onClick={handleSend}
					disabled={isLoading || !message.trim()}>
					<Send size={18} />
				</Button>
			</Box>
		</header>
	);
};

export default ChatSendMessage;
