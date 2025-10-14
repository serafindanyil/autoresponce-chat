import { cva } from "class-variance-authority";

import Box from "@/ui/box/box";
import UserIcon from "@/ui/icon-user/icon-user";
import clsx from "clsx";
import UpdatesBadge from "@/ui/updates-badge/updates-badge";

type ChatItemProps = {
	firstName: string;
	lastName: string;
	time: string;
	lastMessage?: string;
	updates?: number;
	state?: "default" | "active";
	collapsed?: boolean;
};

const CHAT_ITEM_CLASS = cva(
	"flex gap-4 items-center w-full px-3 py-4 transition-colors duration-200 xl:hover:bg-muted/50 cursor-pointer",
	{
		variants: {
			state: {
				default: "bg-transparent hover:bg-muted/10",
				active: "bg-muted/50",
			},
			collapsed: {
				true: "justify-center",
				false: "justify-start",
			},
		},
		defaultVariants: {
			state: "default",
			collapsed: false,
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
	collapsed,
}: ChatItemProps) => {
	const Tag = collapsed ? "div" : Box;

	return (
		<Tag className={CHAT_ITEM_CLASS({ state, collapsed })}>
			<div className="relative">
				<UserIcon userName={[firstName, lastName]} />
				{updates && collapsed && (
					<UpdatesBadge
						updates={updates}
						className="absolute -top-1 -right-1 border-2 border-surface"
					/>
				)}
			</div>
			<div
				className={clsx(collapsed && "hidden", "flex flex-col gap-1 w-full min-w-0")}>
				<div className="flex justify-between gap-2">
					<h4 className="font-semibold text-sm truncate">{`${firstName} ${lastName}`}</h4>
					<span className="text-xs text-muted-foreground flex-shrink-0">{time}</span>
				</div>
				<div className="flex justify-between gap-2 items-center">
					<p className="text-xs text-muted-foreground self-end truncate flex-1">
						{lastMessage ? lastMessage : "No messages yet"}
					</p>
					{updates && <UpdatesBadge updates={updates} className="flex-shrink-0" />}
				</div>
			</div>
		</Tag>
	);
};

export default ChatItem;
