"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Resizable } from "re-resizable";

import Box from "@/ui/box/box";
import IconUser from "@/components/icon-user/icon-user";
import ButtonLogin from "@/components/button-login/button-login";
import InputSearchChat from "@/components/input-search-chat/input-search-chat";

function Sidebar() {
	const [isResizing, setIsResizing] = useState(false);

	return (
		<aside className="h-screen w-full">
			<Resizable
				defaultSize={{
					width: "30%",
					height: "100%",
				}}
				minWidth="10%"
				maxWidth="40%"
				enable={{
					top: false,
					right: true,
					bottom: false,
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				}}
				onResizeStart={() => setIsResizing(true)}
				onResizeStop={() => setIsResizing(false)}
				style={{
					display: "flex",
					flexDirection: "column",
					transition: "width 0.4s ease",
				}}>
				<div
					className={clsx(
						"h-full border-r text-white bg-muted/50 transition-colors duration-300",
						isResizing && "border-r-primary/90"
					)}>
					<Box className="space-y-4">
						<div className="flex gap-4 items-center">
							<IconUser state="active" />
							<ButtonLogin />
						</div>
						<InputSearchChat />
					</Box>
				</div>
			</Resizable>
		</aside>
	);
}

export default Sidebar;
