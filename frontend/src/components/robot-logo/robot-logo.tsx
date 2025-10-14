import clsx from "clsx";

import { Bot } from "lucide-react";

const RobotLogo = ({ className }: { className?: string }) => {
	return (
		<div className={clsx("p-4 bg-primary/10 rounded-full w-fit", className)}>
			<Bot size={32} className="text-primary" />
		</div>
	);
};

export default RobotLogo;
