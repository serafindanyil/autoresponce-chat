"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Resizable } from "re-resizable";

import SidebarHeaderPanel from "@/components/sidebar-header-panel/sidebar-header-panel";
import SidebarAddChatPanel from "@/components/sidebar-add-chat-panel/sidebar-add-chat-panel";
import SidebarChatsPanel from "@/components/sidebar-chats-panel/sidebar-chats-panel";

function Sidebar() {
	const [isResizing, setIsResizing] = useState(false);

	return (
		<aside className="h-screen flex-shrink-0">
			<Resizable
				defaultSize={{
					width: "30vw",
					height: "100%",
				}}
				minWidth="30vw"
				maxWidth="40vw"
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
					<SidebarHeaderPanel />
					<SidebarAddChatPanel />
					<SidebarChatsPanel />
				</div>
			</Resizable>
		</aside>
	);
}

export default Sidebar;
