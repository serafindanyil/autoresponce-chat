import Box from "@/ui/box/box";
import ButtonNewChat from "@/components/button-new-chat/button-new-chat";

const SidebarAddChatPanel = () => {
	return (
		<section>
			<Box className="flex gap-4 items-center justify-between">
				<h3 className="font-semibold text-sm text-accent">Chats</h3>
				<ButtonNewChat />
			</Box>
		</section>
	);
};

export default SidebarAddChatPanel;
