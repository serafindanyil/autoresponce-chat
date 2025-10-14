import { useMemo, useState } from "react";
import { useChats } from "./use-chats";
import { useDebounce } from "./use-debounce";
import type { Chat } from "@/shared/types";

export const useSearchChats = () => {
	const { chats } = useChats();
	const [searchQuery, setSearchQuery] = useState("");

	// Debounce search query to avoid excessive filtering
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const filteredChats = useMemo(() => {
		if (!debouncedSearchQuery.trim()) {
			return chats;
		}

		const query = debouncedSearchQuery.toLowerCase().trim();

		return chats.filter((chat: Chat) => {
			const fullName = `${chat.firstName} ${chat.lastName}`.toLowerCase();
			return fullName.includes(query);
		});
	}, [chats, debouncedSearchQuery]);

	return {
		searchQuery,
		setSearchQuery,
		filteredChats,
		hasActiveSearch: debouncedSearchQuery.trim().length > 0,
	};
};
