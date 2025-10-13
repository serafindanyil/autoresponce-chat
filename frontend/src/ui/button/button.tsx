import clsx from "clsx";

type ButtonProps = {
	children: React.ReactNode;
	className?: string;
};

const Button = ({ children, className }: ButtonProps) => {
	return (
		<button
			className={clsx(
				"flex items-center justify-center gap-3 px-6 py-3 bg-background text-white rounded font-semibold text-4 border duration-300 hover:bg-primary/90 active:scale-95",
				className
			)}>
			{children}
		</button>
	);
};

export default Button;
