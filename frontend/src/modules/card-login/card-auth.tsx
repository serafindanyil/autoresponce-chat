import RobotLogo from "@/components/robot-logo/robot-logo";

import Card from "@/ui/card/card";
import ButtonAuthGoogle from "@/components/button-auth-google/button-auth-google";

const CardAuth = () => {
	return (
		<Card className="p-10 max-w-[25rem] w-full flex flex-col gap-8 justify-center items-center text-center">
			<RobotLogo className="self-center" />
			<div className="space-y-2">
				<h1 className="font-semibold text-3xl">Welcome Back</h1>
				<p className="text-sm text-muted-foreground">
					Sign in to continue to your chat app
				</p>
			</div>
			<ButtonAuthGoogle />
		</Card>
	);
};

export default CardAuth;
