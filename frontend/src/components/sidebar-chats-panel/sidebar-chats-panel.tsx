"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import ChatItem from "@/components/chat-item/chat-item";
import { useChats } from "@/shared/hooks/use-chats";

type SidebarChatsPanelProps = {
	collapsed: boolean;
};

const SidebarChatsPanel = ({ collapsed }: SidebarChatsPanelProps) => {
	const { chats, getChatMessages } = useChats();
	const params = useParams();
	const currentChatId = params?.chatID as string;

	return (
		<section
			className={clsx(
				"flex flex-col items-start cursor-pointer",
				collapsed && "items-center"
			)}>
			{chats.map((chat) => {
				const messages = getChatMessages(chat._id);
				const lastMessage = messages[messages.length - 1];
				const isActive = currentChatId === chat._id;

				return (
					<Link key={chat._id} href={`/${chat._id}`} className="w-full">
						<ChatItem
							firstName={chat.firstName}
							lastName={chat.lastName}
							lastMessage={lastMessage?.text}
							time={
								lastMessage
									? new Date(lastMessage.createdAt).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
									  })
									: ""
							}
							collapsed={collapsed}
							state={isActive ? "active" : "default"}
						/>
					</Link>
				);
			})}
		</section>
	);
};

export default SidebarChatsPanel;
