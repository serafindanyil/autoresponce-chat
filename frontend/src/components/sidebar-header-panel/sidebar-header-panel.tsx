import Box from "@/ui/box/box";
import IconUser from "@/ui/icon-user/icon-user";
import ButtonLogin from "@/components/button-login/button-login";
import InputSearchChat from "@/components/input-search-chat/input-search-chat";

const SidebarHeaderPanel = () => {
	return (
		<section>
			<Box className="space-y-4">
				<div className="flex gap-4 items-center">
					<IconUser state="active" />
					<ButtonLogin />
				</div>
				<InputSearchChat />
			</Box>
		</section>
	);
};

export default SidebarHeaderPanel;
