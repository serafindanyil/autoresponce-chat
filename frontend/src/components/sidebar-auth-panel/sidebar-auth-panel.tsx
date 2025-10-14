"use client";

import clsx from "clsx";

import Box from "@/ui/box/box";
import ButtonAccount from "@/components/button-account/button-account";
import ButtonLogin from "@/components/button-login/button-login";

type SidebarAuthPanelProps = {
	collapsed: boolean;
};

const SidebarAuthPanel = ({ collapsed }: SidebarAuthPanelProps) => {
	const containerClasses = clsx(
		"space-y-4",
		collapsed && "!space-y-3 flex flex-col items-center"
	);

	return (
		<section>
			<Box className={containerClasses}>
				<div
					className={clsx(
						"flex w-full items-center justify-between",
						collapsed ? "flex-col gap-3" : "gap-4"
					)}>
					{!collapsed && <ButtonLogin />}
					<ButtonAccount size="md" />
				</div>
			</Box>
		</section>
	);
};

export default SidebarAuthPanel;
