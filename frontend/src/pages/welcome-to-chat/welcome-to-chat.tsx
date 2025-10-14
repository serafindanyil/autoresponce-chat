import RobotLogo from "@/components/robot-logo/robot-logo";

const WelcomeToChat = () => {
	return (
		<main className="flex items-center justify-center h-screen w-full pl-4 pr-4 md:pl-0 md:pr-0">
			<section className="flex flex-col items-center gap-3 text-center">
				<div>
					<RobotLogo className="self-center" />
				</div>
				<h1 className="font-semibold text-3xl">Welcome to Autoresponce Chat</h1>
				<p className="text-sm text-muted-foreground">
					Select chat from the list or start a new conversation. For Reenbit
					with love
				</p>
			</section>
		</main>
	);
};

export default WelcomeToChat;
