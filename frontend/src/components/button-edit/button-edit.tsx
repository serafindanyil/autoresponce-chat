"use client";

import { useState } from "react";
import Button from "@/ui/button/button";
import { Pencil } from "lucide-react";
import { useUpdateChatMutation } from "@/shared/services/api.service";
import Modal from "@/ui/modal/modal";
import ChatForm, { type ChatFormData } from "@/components/chat-form/chat-form";

type ButtonEditProps = {
	chatId: string;
	currentFirstName: string;
	currentLastName: string;
};

const ButtonEdit = ({
	chatId,
	currentFirstName,
	currentLastName,
}: ButtonEditProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [updateChat, { isLoading }] = useUpdateChatMutation();

	const handleSubmit = async (data: ChatFormData) => {
		try {
			await updateChat({
				chatId,
				data,
			}).unwrap();
			setIsModalOpen(false);
		} catch (error) {
			console.error("Failed to update chat:", error);
		}
	};

	return (
		<>
			<Button
				onClick={() => setIsModalOpen(true)}
				state="transparent"
				size="sm">
				<Pencil size={16} />
				<p className="hidden xl:block">Edit</p>
			</Button>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="Edit Chat"
				size="sm">
				<ChatForm
					initialData={{
						firstName: currentFirstName,
						lastName: currentLastName,
					}}
					onSubmit={handleSubmit}
					onCancel={() => setIsModalOpen(false)}
					isLoading={isLoading}
					submitLabel="Update"
				/>
			</Modal>
		</>
	);
};

export default ButtonEdit;
