import InputSearch from "@/components/input-search/input-search";
import Box from "@/ui/box/box";

const SidebarSearchChat = () => {
	return (
		<Box className="flex items-center gap-2">
			<InputSearch className="w-full" placeholder="Search chat" />
		</Box>
	);
};

export default SidebarSearchChat;
