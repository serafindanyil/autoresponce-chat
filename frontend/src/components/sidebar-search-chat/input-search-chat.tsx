"use client";

import InputSearch from "@/components/input-search/input-search";
import Box from "@/ui/box/box";

type SidebarSearchChatProps = {
	value: string;
	onChange: (value: string) => void;
};

const SidebarSearchChat = ({ value, onChange }: SidebarSearchChatProps) => {
	return (
		<Box className="flex items-center gap-2">
			<InputSearch
				className="w-full"
				placeholder="Search chat"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</Box>
	);
};

export default SidebarSearchChat;
