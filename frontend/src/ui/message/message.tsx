"use client";

import { useState } from "react";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import { Pencil, Trash, Check, X } from "lucide-react";
import IconUser from "@/ui/icon-user/icon-user";
import {
	useUpdateMessageMutation,
	useDeleteMessageMutation,
} from "@/shared/services/api.service";

type MessageProps = {
	messageId: string;
	firstName: string;
	lastName: string;
	message: string;
	date: string;
	isMine: boolean;
	isBot?: boolean;
};

const MESSAGE_CLASS = cva("flex gap-2 text-white items-start group", {
	variants: {
		isMine: {
			true: "flex-row-reverse text-right",
			false: "flex-row text-left",
		},
	},
});

const Message = ({
	messageId,
	firstName,
	lastName,
	message,
	date,
	isMine,
	isBot = false,
	...props
}: MessageProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedText, setEditedText] = useState(message);
	const [updateMessage, { isLoading: isUpdating }] = useUpdateMessageMutation();
	const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

	const handleUpdate = async () => {
		if (editedText.trim() && editedText !== message) {
			try {
				await updateMessage({
					messageId,
					data: { text: editedText },
				}).unwrap();
				setIsEditing(false);
			} catch (error) {
				console.error("Failed to update message:", error);
			}
		} else {
			setIsEditing(false);
			setEditedText(message);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteMessage(messageId).unwrap();
		} catch (error) {
			console.error("Failed to delete message:", error);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleUpdate();
		} else if (e.key === "Escape") {
			setIsEditing(false);
			setEditedText(message);
		}
	};

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
				<div className="relative">
					<div
						className={clsx(
							"px-4 py-2 rounded",
							isMine ? "bg-userMessage" : "bg-muted"
						)}>
						{isEditing ? (
							<input
								type="text"
								value={editedText}
								onChange={(e) => setEditedText(e.target.value)}
								onKeyDown={handleKeyPress}
								className="bg-transparent border-b border-white/30 outline-none font-medium text-sm min-w-[200px]"
								autoFocus
								disabled={isUpdating}
							/>
						) : (
							<p className="font-medium text-sm">{message}</p>
						)}
					</div>
					{isMine && !isBot && (
						<div
							className={clsx(
								"absolute top-1 flex gap-1 transition-opacity",
								isMine ? "-left-20" : "-right-20",
								isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
							)}>
							{isEditing ? (
								<>
									<button
										onClick={handleUpdate}
										disabled={isUpdating}
										className="p-1 rounded hover:bg-white/10 transition-colors">
										<Check size={14} />
									</button>
									<button
										onClick={() => {
											setIsEditing(false);
											setEditedText(message);
										}}
										disabled={isUpdating}
										className="p-1 rounded hover:bg-white/10 transition-colors">
										<X size={14} />
									</button>
								</>
							) : (
								<>
									<button
										onClick={() => setIsEditing(true)}
										className="p-1 rounded hover:bg-white/10 transition-colors">
										<Pencil size={14} />
									</button>
									<button
										onClick={handleDelete}
										disabled={isDeleting}
										className="p-1 rounded hover:bg-white/10 transition-colors">
										<Trash size={14} />
									</button>
								</>
							)}
						</div>
					)}
				</div>
				<span className="text-xs text-muted-foreground/50">{date}</span>
			</div>
		</div>
	);
};

export default Message;
