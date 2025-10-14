"use client";

import { useState } from "react";
import Button from "@/ui/button/button";
import ConfirmDialog from "@/ui/confirm-dialog/confirm-dialog";
import { Trash } from "lucide-react";
import { useDeleteChatMutation } from "@/shared/services/api.service";

type ButtonDeleteProps = {
	chatId: string;
	chatName: string;
	onSuccess?: () => void;
};

const ButtonDelete = ({ chatId, chatName, onSuccess }: ButtonDeleteProps) => {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [deleteChat, { isLoading }] = useDeleteChatMutation();

	const handleConfirm = async () => {
		try {
			await deleteChat(chatId).unwrap();
			setIsConfirmOpen(false);
			onSuccess?.();
		} catch (error) {
			console.error("Failed to delete chat:", error);
		}
	};

	return (
		<>
			<Button
				onClick={() => setIsConfirmOpen(true)}
				state="transparent"
				size="sm"
				disabled={isLoading}>
				<Trash size={16} />
				<p className="hidden xl:block">Delete</p>
			</Button>

			<ConfirmDialog
				isOpen={isConfirmOpen}
				onConfirm={handleConfirm}
				onCancel={() => setIsConfirmOpen(false)}
				title="Delete Chat"
				message={`Are you sure you want to delete your conversation with ${chatName}? This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				isLoading={isLoading}
				variant="danger"
			/>
		</>
	);
};

export default ButtonDelete;
