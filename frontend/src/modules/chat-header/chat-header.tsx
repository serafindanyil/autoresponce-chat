import Box from "@/ui/box/box";
import IconUser from "@/ui/icon-user/icon-user";
import ButtonEdit from "@/components/button-edit/button-edit";
import ButtonDelete from "@/components/button-delete/button-delete";

const FIRTS_NAME = "Alice";
const LAST_NAME = "Freeman";

const ChatHeader = () => {
	return (
		<header className="w-full">
			<Box className="flex items-center justify-between bg-muted/30 w-full">
				<div className="flex gap-4 items-center">
					<IconUser state="active" userName={[FIRTS_NAME, LAST_NAME]} />
					<h2 className="text-sm xl:text-lg font-bold">{`${FIRTS_NAME} ${LAST_NAME}`}</h2>
				</div>
				<div className="flex gap-2">
					<ButtonEdit />
					<ButtonDelete />
				</div>
			</Box>
		</header>
	);
};

export default ChatHeader;
