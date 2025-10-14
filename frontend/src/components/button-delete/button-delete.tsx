"use client";

import Button from "@/ui/button/button";
import { Trash } from "lucide-react";
import { useDeleteChatMutation } from "@/shared/services/api.service";

type ButtonDeleteProps = {
	chatId: string;
	onSuccess?: () => void;
};

const ButtonDelete = ({ chatId, onSuccess }: ButtonDeleteProps) => {
	const [deleteChat, { isLoading }] = useDeleteChatMutation();

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this chat?")) {
			try {
				await deleteChat(chatId).unwrap();
				onSuccess?.();
			} catch (error) {
				console.error("Failed to delete chat:", error);
			}
		}
	};

	return (
		<Button
			onClick={handleDelete}
			state="transparent"
			size="sm"
			disabled={isLoading}>
			<Trash size={16} />
			<p className="hidden xl:block">Delete</p>
		</Button>
	);
};

export default ButtonDelete;
