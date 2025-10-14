"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/shared/store";
import Message from "@/ui/message/message";
import { useChats } from "@/shared/hooks/use-chats";

type ChatListProps = {
	chatId: string;
};

const ChatList = ({ chatId }: ChatListProps) => {
	const { getChatMessages } = useChats();
	const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
	const messages = getChatMessages(chatId);

	return (
		<section className="px-8 pt-8 pb-2 w-full h-full overflow-y-auto space-y-4">
			{messages.map((message) => {
				const isMine = message.author.userId === currentUserId;
				const [firstName = "", lastName = ""] = message.author.name.split(" ");

				return (
					<Message
						key={message._id}
						messageId={message._id}
						firstName={firstName}
						lastName={lastName}
						message={message.text}
						date={new Date(message.createdAt).toLocaleString()}
						isMine={isMine}
						isBot={message.author.isBot}
					/>
				);
			})}
		</section>
	);
};

export default ChatList;
