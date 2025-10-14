import clsx from "clsx";

import Box from "@/ui/box/box";
import ButtonNewChat from "@/components/button-new-chat/button-new-chat";

const SidebarAddChatPanel = () => {
	return (
		<section>
			<Box className={clsx("flex items-center justify-between gap-4")}>
				<h3 className="font-semibold text-sm text-accent">Chats</h3>
				<ButtonNewChat />
			</Box>
		</section>
	);
};

export default SidebarAddChatPanel;
