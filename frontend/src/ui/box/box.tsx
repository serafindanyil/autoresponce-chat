import clsx from "clsx";

const Box = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<section className={clsx("p-3 border-b", className)}>{children}</section>
	);
};

export default Box;
