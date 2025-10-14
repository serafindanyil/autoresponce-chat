"use client";

import { useState, useEffect } from "react";
import { socketService } from "@/shared/services/socket.service";

import { Bot } from "lucide-react";

import Box from "@/ui/box/box";
import Button from "@/ui/button/button";

interface BroadcastNotification {
	type: string;
	enabled: boolean;
}

export function ButtonToggleBroadcast() {
	const [isEnabled, setIsEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const handleNotification = (data: unknown) => {
			if (
				data &&
				typeof data === "object" &&
				"type" in data &&
				data.type === "bot-toggle"
			) {
				const notification = data as BroadcastNotification;
				setIsEnabled(notification.enabled);
				setIsLoading(false);
			}
		};

		void handleNotification;
	}, []);

	const handleToggle = () => {
		setIsLoading(true);
		const newState = !isEnabled;

		socketService.toggleAutoBot(newState);

		setTimeout(() => {
			setIsEnabled(newState);
			setIsLoading(false);
		}, 300);
	};

	return (
		<Box className="w-fulll">
			<Button
				onClick={handleToggle}
				state={isEnabled ? "primary" : "secondary"}
				disabled={isLoading}
				className="w-full">
				{isLoading ? (
					<span className="flex items-center gap-2">
						<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
						Processing...
					</span>
				) : isEnabled ? (
					<span className="flex items-center gap-2">
						<Bot size={16} />
						Auto-Bot Active
					</span>
				) : (
					<span className="flex items-center gap-2">
						<Bot size={16} />
						Enable Auto-Bot
					</span>
				)}
			</Button>
		</Box>
	);
}
