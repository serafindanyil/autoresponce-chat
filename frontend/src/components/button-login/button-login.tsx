"use client";

import clsx from "clsx";
import useAppSelector from "@/shared/hooks/use-app-selector";
import { useLogout } from "@/shared/hooks/use-logout";

import Button from "@/ui/button/button";

const ButtonLogin = () => {
	const token = useAppSelector((state) => state.auth.token);
	const isLoggedIn = Boolean(token);
	const { logout, isLoading } = useLogout();

	const handleClick = () => {
		if (isLoggedIn) {
			logout();
		}
	};

	return (
		<Button
			onClick={handleClick}
			size={"md"}
			className={clsx("gap-2")}
			aria-label={isLoggedIn ? "Logout" : "Login"}
			disabled={isLoading}>
			{isLoggedIn ? "Logout" : "Login"}
		</Button>
	);
};

export default ButtonLogin;
