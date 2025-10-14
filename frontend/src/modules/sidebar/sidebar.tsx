"use client";

import clsx from "clsx";
import { Resizable } from "re-resizable";

import SidebarHeaderPanel from "@/components/sidebar-header-panel/sidebar-header-panel";
import SidebarAuthPanel from "@/components/sidebar-auth-panel/sidebar-auth-panel";
import SidebarAddChatPanel from "@/components/sidebar-add-chat-panel/sidebar-add-chat-panel";
import SidebarChatsPanel from "@/components/sidebar-chats-panel/sidebar-chats-panel";
import SidebarSearchChat from "@/components/sidebar-search-chat/input-search-chat";
import { ButtonToggleBroadcast } from "@/components/button-toggle-broadcast";
import { SIDEBAR_DIMENSIONS, useSidebar } from "@/shared/hooks/use-sidebar";
import { useSearchChats } from "@/shared/hooks/use-search-chats";

const Sidebar = () => {
	const {
		isDesktop,
		isOpen,
		isResizing,
		sidebarWidth,
		collapsedWidth,
		shouldShowOverlay,
		enableResize,
		toggleSidebar,
		handleResize,
		handleResizeStop,
	} = useSidebar();

	const { searchQuery, setSearchQuery, filteredChats } = useSearchChats();

	const isCollapsed = !isOpen;

	const sidebarBody = (
		<div
			data-collapsed={isCollapsed}
			className={clsx(
				"flex h-full w-full flex-col border-r border-white/10 bg-surface text-white transition-[opacity,transform] duration-300",
				isDesktop && isResizing && isOpen && "border-r-primary/90",
				isDesktop && isCollapsed && "overflow-hidden"
			)}>
			<SidebarHeaderPanel collapsed={isCollapsed} onToggle={toggleSidebar} />
			<SidebarAuthPanel collapsed={isCollapsed} />
			{!isCollapsed && (
				<SidebarSearchChat value={searchQuery} onChange={setSearchQuery} />
			)}
			{!isCollapsed && <SidebarAddChatPanel />}
			{!isCollapsed && <ButtonToggleBroadcast />}
			<SidebarChatsPanel
				collapsed={isCollapsed}
				filteredChats={filteredChats}
			/>
		</div>
	);

	return (
		<>
			{shouldShowOverlay && (
				<div
					role="presentation"
					onClick={toggleSidebar}
					className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
				/>
			)}
			<aside
				className={clsx(
					"relative h-screen transition-[width] duration-300",
					isDesktop ? "flex-shrink-0" : "fixed inset-y-0 left-0 z-50"
				)}
				style={{ width: sidebarWidth }}>
				{isDesktop ? (
					<Resizable
						size={{
							width: sidebarWidth,
							height: "100%",
						}}
						minWidth={
							isCollapsed ? collapsedWidth : SIDEBAR_DIMENSIONS.MIN_WIDTH
						}
						maxWidth={
							isCollapsed ? collapsedWidth : SIDEBAR_DIMENSIONS.MAX_WIDTH
						}
						enable={{ right: enableResize }}
						onResize={handleResize}
						onResizeStop={handleResizeStop}
						style={{
							display: "flex",
							flexDirection: "column",
							transition: isResizing ? "none" : "width 0.3s ease",
						}}>
						{sidebarBody}
					</Resizable>
				) : (
					<div
						className="flex h-full w-full flex-col"
						style={{ width: sidebarWidth }}>
						{sidebarBody}
					</div>
				)}
			</aside>
		</>
	);
};

export default Sidebar;
