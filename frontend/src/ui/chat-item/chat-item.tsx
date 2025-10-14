import Box from "@/ui/box/box";
import UserIcon from "@/ui/icon-user/icon-user";

type ChatItemProps = {
	firstName: string;
	lastName: string;
	time: string;
	lastMessage?: string;
	updates?: number;
};

const ChatItem = ({
	firstName,
	lastName,
	time,
	lastMessage,
	updates = undefined,
}: ChatItemProps) => {
	return (
		<Box className="flex gap-4 items-center w-full">
			<div>
				<UserIcon userName={[firstName, lastName]} />
			</div>
			<div className="w-full space-y-1">
				<div className="flex justify-between">
					<h4 className="font-semibold text-sm">{`${firstName} ${lastName}`}</h4>
					<span className="text-xs text-muted-foreground">{time}</span>
				</div>
				<div className="flex justify-between">
					<p className="text-xs text-muted-foreground self-end truncate">
						{lastMessage ? lastMessage : "No messages yet"}
					</p>
					{updates && (
						<span className="font-semibold text-xs bg-primary px-2 h-5 leading-5 rounded">
							{updates}
						</span>
					)}
				</div>
			</div>
		</Box>
	);
};

export default ChatItem;
