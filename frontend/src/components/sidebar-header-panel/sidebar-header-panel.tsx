import clsx from "clsx";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import Box from "@/ui/box/box";

type SidebarHeaderPanelProps = {
	collapsed: boolean;
	onToggle: () => void;
};

const SidebarHeaderPanel = ({
	collapsed,
	onToggle,
}: SidebarHeaderPanelProps) => {
	const containerClasses = clsx(
		"space-y-4",
		collapsed && "!space-y-3 flex flex-col items-center"
	);

	return (
		<section>
			<Box className={containerClasses}>
				<div
					className={clsx(
						"flex w-full items-center",
						collapsed ? "flex-col gap-3" : "gap-4"
					)}>
					<button
						type="button"
						onClick={onToggle}
						aria-expanded={!collapsed}
						className={clsx(
							"flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform duration-200 focus:outline-none focus-visible:ring",
							collapsed ? "order-2" : "order-1"
						)}>
						{collapsed ? (
							<PanelLeftOpen size={18} />
						) : (
							<PanelLeftClose size={18} />
						)}
					</button>
				</div>
			</Box>
		</section>
	);
};

export default SidebarHeaderPanel;
