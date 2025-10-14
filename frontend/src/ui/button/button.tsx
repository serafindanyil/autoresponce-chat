import { cva } from "class-variance-authority";
import clsx from "clsx";

type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	size?: "sm" | "md" | "bg";
	state?: "default" | "transparent" | "active";
};

const BUTTON_CLASS = cva(
	"flex items-center justify-center px-6 text-white rounded font-semibold border duration-300 active:scale-95 whitespace-nowrap",
	{
		variants: {
			size: {
				bg: "px-6 py-3 text-base gap-3",
				md: "px-4 py-2 text-sm gap-2",
				sm: "px-3 py-2 text-xs gap-2",
			},
			state: {
				default: "bg-background xl:hover:bg-primary/90",
				transparent: "bg-transparent xl:hover:bg-primary/90",
				active: "bg-accent border-accent xl:hover:bg-primary/90",
			},
		},
		defaultVariants: {
			size: "md",
			state: "default",
		},
	}
);

const Button = ({ children, className, size, state }: ButtonProps) => {
	return (
		<button className={clsx(BUTTON_CLASS({ size, state }), className)}>
			{children}
		</button>
	);
};

export default Button;
