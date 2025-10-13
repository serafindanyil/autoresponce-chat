import { Bot } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

import Card from "@/ui/card/card";
import Button from "@/ui/button/button";

const CardAuth = () => {
	return (
		<Card className="p-10 max-w-[25rem] w-full flex flex-col gap-8 justify-center items-center text-center">
			<div className="p-4 bg-primary/10 rounded-full">
				<Bot size={32} className="text-primary" />
			</div>
			<div className="space-y-2">
				<h1 className="font-semibold text-3xl">Welcome Back</h1>
				<p className="text-sm text-muted-foreground">
					Sign in to continue to your chat app
				</p>
			</div>
			<Button className="w-full">
				<FaGoogle size={16} />
				<p>Continue with Google</p>
			</Button>
		</Card>
	);
};

export default CardAuth;
