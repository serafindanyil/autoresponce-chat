import Button from "@/ui/button/button";
import { Trash } from "lucide-react";

const ButtonDelete = () => {
	return (
		<Button state="transparent" size="sm">
			<Trash size={16} />
			<p>Delete</p>
		</Button>
	);
};

export default ButtonDelete;
