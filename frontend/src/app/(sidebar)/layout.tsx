import Sidebar from "@/modules/sidebar/sidebar";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="flex h-screen w-full overflow-hidden">
			<Sidebar />
			<section className="flex-1 min-w-0 h-full overflow-hidden">
				{children}
			</section>
		</main>
	);
}
