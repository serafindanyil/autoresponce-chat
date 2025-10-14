import { cva } from "class-variance-authority";

import Box from "@/ui/box/box";
import UserIcon from "@/ui/icon-user/icon-user";

type ChatItemProps = {
	firstName: string;
	lastName: string;
	time: string;
	lastMessage?: string;
	updates?: number;
	state?: "default" | "active";
};

const CHAT_ITEM_CLASS = cva(
	"flex gap-4 items-center w-full px-3 py-4 transition-colors duration-200 xl:hover:bg-muted/50 cursor-pointer",
	{
		variants: {
			state: {
				default: "bg-transparent hover:bg-muted/10",
				active: "bg-muted/50",
			},
		},
		defaultVariants: {
			state: "default",
		},
	}
);

const ChatItem = ({
	firstName,
	lastName,
	time,
	lastMessage,
	updates = undefined,
	state,
}: ChatItemProps) => {
	return (
		<Box className={CHAT_ITEM_CLASS({ state })}>
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
