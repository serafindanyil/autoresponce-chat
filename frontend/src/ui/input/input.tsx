import { cva } from "class-variance-authority";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	className?: string;
	size?: "sm" | "md";
};

const INPUT_CLASS = cva(
	"flex w-full items-center justify-center gap-3  p-4 py-2 bg-muted/50 text-sm placeholder:text-muted-foreground/80 rounded border duration-300 outline-none placeholder:text-muted-foreground focus:border-primary xl:hover:border-primary/80 truncate",
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

const Input = ({ className, size, ...props }: InputProps) => {
	return (
		<input className={clsx(INPUT_CLASS({ size }), className)} {...props} />
	);
};

export default Input;
