import Button from "@/ui/button/button";
import { Pencil } from "lucide-react";

const ButtonEdit = () => {
	return (
		<Button state="transparent" size="sm">
			<Pencil size={16} />
			<p className="hidden xl:block">Edit</p>
		</Button>
	);
};

export default ButtonEdit;
