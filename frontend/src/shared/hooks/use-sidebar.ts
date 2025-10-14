import { useCallback, useEffect, useMemo, useState } from "react";
import type { ResizeCallback } from "re-resizable";

import { useDevice } from "@/shared/hooks/use-device";

export const SIDEBAR_DIMENSIONS = {
	DEFAULT_WIDTH: 360,
	MIN_WIDTH: 280,
	MAX_WIDTH: 480,
	COLLAPSED_WIDTH: 64,
	COLLAPSE_THRESHOLD: 220,
} as const;

const {
	DEFAULT_WIDTH,
	MIN_WIDTH,
	MAX_WIDTH,
	COLLAPSED_WIDTH,
	COLLAPSE_THRESHOLD,
} = SIDEBAR_DIMENSIONS;

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const getMobileWidth = (viewport: number) => {
	const candidate = viewport - 48;
	return clamp(candidate, MIN_WIDTH, MAX_WIDTH);
};

export const useSidebar = () => {
	const { device, isDesktop } = useDevice();
	const [width, setWidth] = useState(DEFAULT_WIDTH);
	const [isOpen, setIsOpen] = useState(isDesktop);
	const [isResizing, setIsResizing] = useState(false);
	const [viewportWidth, setViewportWidth] = useState(() =>
		typeof window === "undefined" ? DEFAULT_WIDTH : window.innerWidth
	);

	useEffect(() => {
		if (!isDesktop) {
			const updateViewport = () => setViewportWidth(window.innerWidth);
			updateViewport();
			window.addEventListener("resize", updateViewport);

			return () => window.removeEventListener("resize", updateViewport);
		}
	}, [isDesktop]);

	useEffect(() => {
		if (!isDesktop) {
			setWidth(getMobileWidth(viewportWidth));
		}
	}, [isDesktop, viewportWidth]);

	useEffect(() => {
		setIsOpen(isDesktop);
	}, [isDesktop]);

	const toggleSidebar = useCallback(() => {
		setIsOpen((prev) => {
			if (!prev && width < MIN_WIDTH) {
				setWidth(isDesktop ? DEFAULT_WIDTH : getMobileWidth(viewportWidth));
			}
			return !prev;
		});
	}, [isDesktop, viewportWidth, width]);

	const handleResize: ResizeCallback = useCallback((_, __, ref) => {
		setIsResizing(true);
		setWidth(ref.offsetWidth);
	}, []);

	const handleResizeStop: ResizeCallback = useCallback((_, __, ref) => {
		setIsResizing(false);
		const newWidth = ref.offsetWidth;

		if (newWidth <= COLLAPSE_THRESHOLD) {
			setIsOpen(false);
			setWidth(DEFAULT_WIDTH);
			return;
		}

		setWidth(clamp(newWidth, MIN_WIDTH, MAX_WIDTH));
	}, []);

	const sidebarWidth = useMemo(() => {
		if (isDesktop) {
			return isOpen ? clamp(width, MIN_WIDTH, MAX_WIDTH) : COLLAPSED_WIDTH;
		}

		return isOpen ? getMobileWidth(viewportWidth) : COLLAPSED_WIDTH;
	}, [isDesktop, isOpen, viewportWidth, width]);

	return {
		device,
		isDesktop,
		isOpen,
		isResizing,
		sidebarWidth,
		collapsedWidth: SIDEBAR_DIMENSIONS.COLLAPSED_WIDTH,
		shouldShowOverlay: !isDesktop && isOpen,
		enableResize: isDesktop && isOpen,
		toggleSidebar,
		handleResize,
		handleResizeStop,
	};
};
