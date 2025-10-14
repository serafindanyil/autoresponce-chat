import { FaGoogle } from "react-icons/fa";
import Button from "@/ui/button/button";

const ButtonAuthGoogle = () => {
	return (
		<Button className="w-full">
			<FaGoogle size={16} />
			<p>Continue with Google</p>
		</Button>
	);
};

export default ButtonAuthGoogle;
