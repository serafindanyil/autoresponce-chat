import { useMemo, useState } from "react";
import { useChats } from "./use-chats";
import type { Chat } from "@/shared/types";

export const useSearchChats = () => {
	const { chats } = useChats();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredChats = useMemo(() => {
		if (!searchQuery.trim()) {
			return chats;
		}

		const query = searchQuery.toLowerCase().trim();

		return chats.filter((chat: Chat) => {
			const fullName = `${chat.firstName} ${chat.lastName}`.toLowerCase();
			return fullName.includes(query);
		});
	}, [chats, searchQuery]);

	return {
		searchQuery,
		setSearchQuery,
		filteredChats,
		hasActiveSearch: searchQuery.trim().length > 0,
	};
};
