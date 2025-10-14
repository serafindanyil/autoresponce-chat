"use client";

import { useState } from "react";
import IconUser from "@/ui/icon-user/icon-user";
import AccountModal from "@/ui/account-modal/account-modal";
import { useAuth } from "@/shared/hooks";

type ButtonAccountProps = {
	size?: "sm" | "md" | "lg";
	className?: string;
};

const ButtonAccount = ({ size = "md", className }: ButtonAccountProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user } = useAuth();

	if (!user) return null;

	const userName = user.name?.split(" ") || ["User"];

	return (
		<>
			<button
				onClick={() => setIsModalOpen(true)}
				className={`cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
				aria-label="Open account settings"
				type="button">
				<IconUser userName={userName} state="active" size={size} />
			</button>

			<AccountModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};

export default ButtonAccount;
