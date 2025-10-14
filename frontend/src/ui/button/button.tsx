import { cva } from "class-variance-authority";
import clsx from "clsx";

type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	size?: "sm" | "md";
};

const BUTTON_CLASS = cva(
	"flex items-center justify-center gap-3 px-6 bg-background text-white rounded font-semibold border duration-300 hover:bg-primary/90 active:scale-95",
	{
		variants: {
			size: {
				bg: "py-3",
				md: "py-2",
				sm: "py-2 text-sm",
			},
		},
		defaultVariants: {
			size: "md",
		},
	}
);

const Button = ({ children, className, size }: ButtonProps) => {
	return (
		<button className={clsx(BUTTON_CLASS({ size }), className)}>
			{children}
		</button>
	);
};

export default Button;
