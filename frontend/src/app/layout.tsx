import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { GoogleOAuthProvider } from "@react-oauth/google";

import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Autoresponce chat",
	description: "The test task for Reenbit",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} font-sans antialiased`}>
				<GoogleOAuthProvider
					clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
					{children}
				</GoogleOAuthProvider>
			</body>
		</html>
	);
}
