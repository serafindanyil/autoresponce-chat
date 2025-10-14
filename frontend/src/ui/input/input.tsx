import { cva } from "class-variance-authority";
import clsx from "clsx";

import { Search } from "lucide-react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	className?: string;
	size?: "sm" | "md";
};

const INPUT_CLASS = cva(
	"flex items-center justify-center gap-3 pl-10 pr-4 py-2 bg-muted/50 text-sm placeholder:text-muted-foreground/80 rounded border duration-300 outline-none placeholder:text-muted-foreground focus:border-primary xl:hover:border-primary/80 truncate",
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
		<div className="relative">
			<input className={clsx(INPUT_CLASS({ size }), className)} {...props} />
			<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/80 w-4 h-4 " />
		</div>
	);
};

export default Input;
