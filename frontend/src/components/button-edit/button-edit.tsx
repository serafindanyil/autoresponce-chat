"use client";

import Button from "@/ui/button/button";
import { Pencil } from "lucide-react";
import { useUpdateChatMutation } from "@/shared/services/api.service";

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
	const [updateChat, { isLoading }] = useUpdateChatMutation();

	const handleEdit = async () => {
		// TODO: Add modal/form for editing
		const first = prompt("Enter first name:", currentFirstName);
		const last = prompt("Enter last name:", currentLastName);

		if (first || last) {
			try {
				await updateChat({
					chatId,
					data: {
						...(first && { firstName: first }),
						...(last && { lastName: last }),
					},
				}).unwrap();
			} catch (error) {
				console.error("Failed to update chat:", error);
			}
		}
	};

	return (
		<Button
			onClick={handleEdit}
			state="transparent"
			size="sm"
			disabled={isLoading}>
			<Pencil size={16} />
			<p className="hidden xl:block">Edit</p>
		</Button>
	);
};

export default ButtonEdit;
