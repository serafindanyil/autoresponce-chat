"use client";

import { useRouter } from "next/navigation";
import Box from "@/ui/box/box";
import IconUser from "@/ui/icon-user/icon-user";
import ButtonEdit from "@/components/button-edit/button-edit";
import ButtonDelete from "@/components/button-delete/button-delete";
import { useChats } from "@/shared/hooks/use-chats";

type ChatHeaderProps = {
	chatId: string;
};

const ChatHeader = ({ chatId }: ChatHeaderProps) => {
	const router = useRouter();
	const { getChat } = useChats();
	const chat = getChat(chatId);

	if (!chat) {
		return null;
	}

	const { firstName, lastName } = chat;

	const handleDeleteSuccess = () => {
		router.push("/");
	};

	return (
		<header className="w-full">
			<Box className="flex items-center justify-between bg-muted/30 w-full">
				<div className="flex gap-4 items-center">
					<IconUser state="active" userName={[firstName, lastName]} />
					<h2 className="text-sm xl:text-lg font-bold">{`${firstName} ${lastName}`}</h2>
				</div>
				<div className="flex gap-2">
					<ButtonEdit
						chatId={chatId}
						currentFirstName={firstName}
						currentLastName={lastName}
					/>
					<ButtonDelete 
						chatId={chatId} 
						chatName={`${firstName} ${lastName}`}
						onSuccess={handleDeleteSuccess} 
					/>
				</div>
			</Box>
		</header>
	);
};

export default ChatHeader;
