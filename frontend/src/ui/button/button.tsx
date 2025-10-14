import { cva } from "class-variance-authority";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode;
	className?: string;
	size?: "sm" | "md" | "bg";
	state?:
		| "default"
		| "transparent"
		| "active"
		| "primary"
		| "secondary"
		| "danger";
};

const BUTTON_CLASS = cva(
	"flex items-center justify-center text-white rounded font-semibold border duration-300 active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed",
	{
		variants: {
			size: {
				bg: "px-4 md:px-6 py-3 text-base gap-3",
				md: "px-3 md:px-4 py-2 text-sm gap-2",
				sm: "px-2 md:px-3 py-2 text-xs gap-2",
			},
			state: {
				default: "bg-surface border xl:hover:bg-primary/90",
				transparent: "bg-transparent border-transparent xl:hover:bg-primary/90",
				active: "bg-accent border-accent xl:hover:bg-primary/90",
				primary: "bg-primary border-primary xl:hover:bg-primary/90",
				secondary: "bg-muted border-muted text-foreground xl:hover:bg-muted/80",
				danger: "bg-red-600 border-red-600 xl:hover:bg-red-700",
			},
		},
		defaultVariants: {
			size: "md",
			state: "default",
		},
	}
);

const Button = ({ children, className, size, state, ...rest }: ButtonProps) => {
	return (
		<button
			{...rest}
			className={clsx(BUTTON_CLASS({ size, state }), className)}>
			{children}
		</button>
	);
};

export default Button;
