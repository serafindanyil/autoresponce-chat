import clsx from "clsx";
import { cva } from "class-variance-authority";
import IconUser from "@/ui/icon-user/icon-user";

type MessageProps = {
	firstName: string;
	lastName: string;
	message: string;
	date: string;
	isMine: boolean;
};

const MESSAGE_CLASS = cva("flex gap-2 text-white items-start", {
	variants: {
		isMine: {
			true: "flex-row-reverse text-right",
			false: "flex-row text-left",
		},
	},
});

const Message = ({
	firstName,
	lastName,
	message,
	date,
	isMine,
	...props
}: MessageProps) => {
	return (
		<div className={clsx(MESSAGE_CLASS({ isMine }))} {...props}>
			<IconUser
				userName={[firstName, lastName]}
				size="sm"
				state={isMine ? "active" : "default"}
			/>
			<div
				className={clsx(
					"flex flex-col gap-1",
					isMine ? "items-end" : "items-start"
				)}>
				<span className="font-semibold text-xs leading-5">
					{isMine ? "You" : `${firstName} ${lastName}`}
				</span>
				<div
					className={clsx(
						"px-4 py-2 rounded",
						isMine ? "bg-userMessage" : "bg-muted"
					)}>
					<p className="font-medium text-sm">{message}</p>
				</div>
				<span className="text-xs text-muted-foreground/50">{date}</span>
			</div>
		</div>
	);
};

export default Message;
