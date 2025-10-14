import clsx from "clsx";
import Link from "next/link";

import Button from "@/ui/button/button";

const ButtonLogin = () => {
	return (
		<Link href="/auth">
			<Button size={"md"} className={clsx("gap-2")} aria-label={undefined}>
				Login
			</Button>
		</Link>
	);
};

export default ButtonLogin;
