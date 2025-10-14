import Button from "@/ui/button/button";
import { Pencil } from "lucide-react";

const ButtonEdit = () => {
	return (
		<Button state="transparent" size="sm">
			<Pencil size={16} />
			<p>Edit</p>
		</Button>
	);
};

export default ButtonEdit;
