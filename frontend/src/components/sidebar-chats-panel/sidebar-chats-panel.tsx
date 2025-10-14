import ChatItem from "@/ui/chat-item/chat-item";

const CHATS_ARRAY = [
	{
		id: 1,
		firstName: "Alice",
		lastName: "Freeman",
		lastMessage: "Hey! How are you?",
		time: "2:30 PM",
	},
	{
		id: 2,
		firstName: "Bob",
		lastName: "Smith",
		lastMessage: "Let's catch up later.",
		time: "1:15 PM",
	},
	{
		id: 3,
		firstName: "Charlie",
		lastName: "Johnson",
		lastMessage: "Did you see the game last night?",
		time: "Yesterday",
		updates: 3,
	},
];

const SidebarChatsPanel = () => {
	return (
		<section className="flex flex-col items-start">
			{CHATS_ARRAY.map((chat) => (
				<ChatItem
					key={chat.id}
					firstName={chat.firstName}
					lastName={chat.lastName}
					lastMessage={chat.lastMessage}
					time={chat.time}
					updates={chat.updates ?? undefined}
				/>
			))}
		</section>
	);
};

export default SidebarChatsPanel;
