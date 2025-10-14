const UpdatesBadge = ({
	updates,
	className,
}: {
	updates: number;
	className?: string;
}) => {
	return (
		<span
			className={`h-5 w-5 flex items-center justify-center bg-primary text-white text-xs font-semibold rounded-full ${className}`}>
			{updates}
		</span>
	);
};

export default UpdatesBadge;
