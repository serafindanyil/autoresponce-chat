"use client";

import { useState } from "react";
import Button from "@/ui/button/button";
import ConfirmDialog from "@/ui/confirm-dialog/confirm-dialog";
import { Trash } from "lucide-react";
import { useDeleteChatMutation } from "@/shared/services/api.service";
import { getErrorMessage } from "@/utils/error-handler";

type ButtonDeleteProps = {
	chatId: string;
	chatName: string;
	onSuccess?: () => void;
};

const ButtonDelete = ({ chatId, chatName, onSuccess }: ButtonDeleteProps) => {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [deleteChat, { isLoading }] = useDeleteChatMutation();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleConfirm = async () => {
		setErrorMessage(null);

		try {
			await deleteChat(chatId).unwrap();
			setIsConfirmOpen(false);
			onSuccess?.();
		} catch (err) {
			const errorMsg = getErrorMessage(err);
			setErrorMessage(errorMsg);
			console.error("Delete chat failed:", err);
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
				message={
					errorMessage
						? errorMessage
						: `Are you sure you want to delete your conversation with ${chatName}? This action cannot be undone.`
				}
				confirmText="Delete"
				cancelText="Cancel"
				isLoading={isLoading}
				variant="danger"
			/>
		</>
	);
};

export default ButtonDelete;
