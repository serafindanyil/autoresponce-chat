import Image from "next/image";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import { User } from "lucide-react";
import nameToInitials from "@/utils/name-to-initials";

const BUTTON_CLASS = cva(
	"flex items-center justify-center rounded-full font-medium text-white overflow-hidden",
	{
		variants: {
			state: {
				default: "bg-muted",
				active: "bg-accent",
			},
			size: {
				sm: "h-8 w-8 text-xs",
				md: "h-10 w-10 text-sm",
				lg: "h-12 w-12 text-base",
			},
		},
		defaultVariants: {
			state: "default",
			size: "md",
		},
	}
);

type IconUserProps = {
	imageUrl?: string;
	userName?: string[];
	state?: "default" | "active";
	size?: "sm" | "md" | "lg";
};

const IconUser = ({ imageUrl, userName, state, size }: IconUserProps) => {
	const namesArray = userName || [];

	const ImageComponent = imageUrl ? (
		<Image src={imageUrl} alt="user avatar" fill />
	) : (
		<User size={20} className="text-white" />
	);

	const component = userName ? nameToInitials(...namesArray) : ImageComponent;

	return <div className={clsx(BUTTON_CLASS({ state, size }))}>{component}</div>;
};

export default IconUser;
