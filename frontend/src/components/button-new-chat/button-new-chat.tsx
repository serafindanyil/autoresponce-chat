"use client";

import { useState } from "react";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useCreateChatMutation } from "@/shared/services/api.service";
import Button from "@/ui/button/button";
import Modal from "@/ui/modal/modal";
import ChatForm, { type ChatFormData } from "@/components/chat-form/chat-form";
import { getErrorMessage } from "@/utils/error-handler";

const ButtonNewChat = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [createChat, { isLoading }] = useCreateChatMutation();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (data: ChatFormData) => {
		setErrorMessage(null);

		try {
			await createChat(data).unwrap();
			setIsModalOpen(false);
		} catch (err) {
			const errorMsg = getErrorMessage(err);
			setErrorMessage(errorMsg);
			console.error("Create chat failed:", err);
		}
	};

	return (
		<>
			<Button
				onClick={() => setIsModalOpen(true)}
				state="transparent"
				size={"sm"}
				className={clsx("gap-2")}
				aria-label={"Create new chat"}>
				<Plus size={16} />
				<p>New Chat</p>
			</Button>

			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setErrorMessage(null);
				}}
				title="Create New Chat"
				size="sm">
				{errorMessage && (
					<div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-500">
						{errorMessage}
					</div>
				)}
				<ChatForm
					onSubmit={handleSubmit}
					onCancel={() => {
						setIsModalOpen(false);
						setErrorMessage(null);
					}}
					isLoading={isLoading}
					submitLabel="Create"
				/>
			</Modal>
		</>
	);
};

export default ButtonNewChat;
