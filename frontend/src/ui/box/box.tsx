import clsx from "clsx";

const Box = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return <div className={clsx("p-3 border-b", className)}>{children}</div>;
};

export default Box;
