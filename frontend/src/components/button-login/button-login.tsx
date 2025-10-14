import Button from "@/ui/button/button";
import Link from "next/link";

const ButtonLogin = () => {
	return (
		<Link href="/auth">
			<Button size="md">Login</Button>
		</Link>
	);
};

export default ButtonLogin;
