import clsx from "clsx";

const Card = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={clsx("bg-muted/50 rounded border", className)}>
			{children}
		</div>
	);
};

export default Card;
