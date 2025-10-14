"use client";

import { useState } from "react";
import Button from "@/ui/button/button";
import { Pencil } from "lucide-react";
import { useUpdateChatMutation } from "@/shared/services/api.service";
import Modal from "@/ui/modal/modal";
import ChatForm, { type ChatFormData } from "@/components/chat-form/chat-form";
import { getErrorMessage } from "@/utils/error-handler";

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
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (data: ChatFormData) => {
		setErrorMessage(null);

		try {
			await updateChat({
				chatId,
				data,
			}).unwrap();
			setIsModalOpen(false);
		} catch (err) {
			const errorMsg = getErrorMessage(err);
			setErrorMessage(errorMsg);
			console.error("Update chat failed:", err);
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
				onClose={() => {
					setIsModalOpen(false);
					setErrorMessage(null);
				}}
				title="Edit Chat"
				size="sm">
				{errorMessage && (
					<div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-500">
						{errorMessage}
					</div>
				)}
				<ChatForm
					initialData={{
						firstName: currentFirstName,
						lastName: currentLastName,
					}}
					onSubmit={handleSubmit}
					onCancel={() => {
						setIsModalOpen(false);
						setErrorMessage(null);
					}}
					isLoading={isLoading}
					submitLabel="Update"
				/>
			</Modal>
		</>
	);
};

export default ButtonEdit;
