import Message from "@/ui/message/message";

const MESSAGES_ARRAY = [
	{
		id: "1",
		isMine: false,
		firstName: "Alice",
		lastName: "Freeman",
		message: "Hello! How can I assist you today?",
		date: "08/07/2025 14:30PM",
	},
	{
		id: "2",
		isMine: true,
		firstName: "Danyil",
		lastName: "Serafin",
		message: "Hello! How can I assist you today?",
		date: "08/07/2025 14:30PM",
	},
];

const ChatHeader = () => {
	return (
		<section className="px-8 pt-8 pb-2 w-full h-full overflow-y-auto space-y-4">
			{MESSAGES_ARRAY.map((message) => (
				<Message
					key={message.id}
					firstName={message.firstName}
					lastName={message.lastName}
					message={message.message}
					date={message.date}
					isMine={message.isMine}
				/>
			))}
		</section>
	);
};

export default ChatHeader;
