"use client";

import { useState } from "react";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useCreateChatMutation } from "@/shared/services/api.service";
import Button from "@/ui/button/button";
import Modal from "@/ui/modal/modal";
import ChatForm, { type ChatFormData } from "@/components/chat-form/chat-form";

const ButtonNewChat = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [createChat, { isLoading }] = useCreateChatMutation();

	const handleSubmit = async (data: ChatFormData) => {
		try {
			await createChat(data).unwrap();
			setIsModalOpen(false);
		} catch (error) {
			console.error("Failed to create chat:", error);
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
				onClose={() => setIsModalOpen(false)}
				title="Create New Chat"
				size="sm">
				<ChatForm
					onSubmit={handleSubmit}
					onCancel={() => setIsModalOpen(false)}
					isLoading={isLoading}
					submitLabel="Create"
				/>
			</Modal>
		</>
	);
};

export default ButtonNewChat;
