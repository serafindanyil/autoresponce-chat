import { useEffect, useState } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

export const useDevice = () => {
	const [device, setDevice] = useState<DeviceType>(() => {
		if (typeof window === "undefined") {
			return "desktop";
		}

		const width = window.innerWidth;
		if (width >= DESKTOP_BREAKPOINT) {
			return "desktop";
		}

		if (width >= TABLET_BREAKPOINT) {
			return "tablet";
		}

		return "mobile";
	});

	useEffect(() => {
		const detectDevice = () => {
			const width = window.innerWidth;

			if (width >= DESKTOP_BREAKPOINT) {
				setDevice("desktop");
				return;
			}

			if (width >= TABLET_BREAKPOINT) {
				setDevice("tablet");
				return;
			}

			setDevice("mobile");
		};

		detectDevice();
		window.addEventListener("resize", detectDevice);

		return () => {
			window.removeEventListener("resize", detectDevice);
		};
	}, []);

	return {
		device,
		isMobile: device === "mobile",
		isTablet: device === "tablet",
		isDesktop: device === "desktop",
	};
};
