"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAppSelector from "@/shared/hooks/use-app-selector";

type ProtectedRouteProps = {
	children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const router = useRouter();
	const token = useAppSelector((state) => state.auth.token);

	useEffect(() => {
		if (!token) {
			router.replace("/auth");
		}
	}, [token, router]);

	if (!token) return null;

	return <>{children}</>;
};

export default ProtectedRoute;
