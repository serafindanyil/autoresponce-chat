import RobotLogo from "@/components/robot-logo/robot-logo";

const WelcomeToChat = () => {
	return (
		<main className="flex items-center justify-center h-screen w-full">
			<section className="flex flex-col items-center gap-3">
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
