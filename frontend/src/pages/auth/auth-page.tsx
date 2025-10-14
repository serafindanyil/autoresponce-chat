"use client";

import dynamic from "next/dynamic";

const CardAuth = dynamic(() => import("@/modules/card-login/card-auth"), {
	ssr: false,
});

const AuthPage = () => {
	return (
		<main className="flex min-h-screen items-center justify-center pl-6 pr-6 md:pl-0 md:pr-0">
			<CardAuth />
		</main>
	);
};

export default AuthPage;
