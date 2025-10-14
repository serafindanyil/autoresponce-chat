"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import ChatItem from "@/components/chat-item/chat-item";
import { useChats } from "@/shared/hooks/use-chats";
import type { Chat } from "@/shared/types";

type SidebarChatsPanelProps = {
	collapsed: boolean;
	filteredChats?: Chat[];
};

const SidebarChatsPanel = ({
	collapsed,
	filteredChats,
}: SidebarChatsPanelProps) => {
	const { chats, getChatMessages } = useChats();
	const params = useParams();
	const currentChatId = params?.chatID as string;

	const displayChats = filteredChats || chats;

	if (displayChats.length === 0) {
		return (
			<div className="flex items-center justify-center py-8 px-4">
				<p className="text-sm text-muted-foreground text-center">
					{filteredChats ? "No chats found" : "No chats yet"}
				</p>
			</div>
		);
	}

	return (
		<section
			className={clsx(
				"flex flex-col items-start cursor-pointer",
				collapsed && "items-center"
			)}>
			{displayChats.map((chat) => {
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
