"use client";

import axios from "axios";

import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

import Button from "@/ui/button/button";

const ButtonAuthGoogle = () => {
	const router = useRouter();

	const login = useGoogleLogin({
		onSuccess: async (response) => {
			try {
				const token = response.access_token;

				console.log("Login success:", token);

				// const { data } = await axios.post(
				// 	"http://localhost:4000/api/auth/google",
				// 	{
				// 		token,
				// 	}
				// );

				// if (data?.token) {
				// }

				router.push("/");
			} catch (err) {
				console.error(" Backend error:", err);
			}
		},
		onError: () => {
			console.error("Google login failed");
		},
	});

	return (
		<Button
			size="bg"
			className="w-full flex items-center justify-center gap-2 bg-neutral-800 text-white hover:bg-neutral-700 transition"
			onClick={() => login()}>
			<FaGoogle size={16} />
			<p>Continue with Google</p>
		</Button>
	);
};

export default ButtonAuthGoogle;
