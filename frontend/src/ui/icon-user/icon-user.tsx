import Image from "next/image";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import { User } from "lucide-react";
import nameToInitials from "@/utils/name-to-initials";

const BUTTON_CLASS = cva(
	"flex items-center justify-center h-10 w-10 rounded-full font-medium text-white overflow-hidden",
	{
		variants: {
			state: {
				default: "bg-muted",
				active: "bg-accent",
			},
		},
		defaultVariants: {
			state: "default",
		},
	}
);

type IconUserProps = {
	imageUrl?: string;
	userName?: string[];
	state?: "default" | "active";
};

const IconUser = ({ imageUrl, userName, state }: IconUserProps) => {
	const namesArray = userName || [];

	const ImageComponent = imageUrl ? (
		<Image src={imageUrl} alt="user avatar" fill />
	) : (
		<User size={20} className="text-white" />
	);

	const component = userName ? nameToInitials(...namesArray) : ImageComponent;

	return <div className={clsx(BUTTON_CLASS({ state }))}>{component}</div>;
};

export default IconUser;
