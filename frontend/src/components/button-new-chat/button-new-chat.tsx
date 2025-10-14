"use client";

import clsx from "clsx";
import { Plus } from "lucide-react";
import { useCreateChatMutation } from "@/shared/services/api.service";

import Button from "@/ui/button/button";

const ButtonNewChat = () => {
	const [createChat, { isLoading }] = useCreateChatMutation();

	const handleCreateChat = async () => {
		// TODO: Add modal/form for entering first and last name
		// For now, using prompt as a simple example
		const first = prompt("Enter first name:");
		const last = prompt("Enter last name:");
		
		if (first && last) {
			try {
				await createChat({
					firstName: first,
					lastName: last,
				}).unwrap();
			} catch (error) {
				console.error("Failed to create chat:", error);
			}
		}
	};

	return (
		<Button
			onClick={handleCreateChat}
			state="transparent"
			size={"sm"}
			className={clsx("gap-2")}
			aria-label={"Create new chat"}
			disabled={isLoading}>
			<Plus size={16} />
			<p>New Chat</p>
		</Button>
	);
};

export default ButtonNewChat;
