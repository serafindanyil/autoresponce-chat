import clsx from "clsx";
import { Plus } from "lucide-react";

import Button from "@/ui/button/button";

const ButtonNewChat = () => {
	return (
		<Button
			state="transparent"
			size={"sm"}
			className={clsx("gap-2")}
			aria-label={"Create new chat"}>
			<Plus size={16} />
			<p>New Chat</p>
		</Button>
	);
};

export default ButtonNewChat;
