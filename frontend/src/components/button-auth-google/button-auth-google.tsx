"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import Button from "@/ui/button/button";
import axios from "axios";

const ButtonAuthGoogle = () => {
	const login = useGoogleLogin({
		onSuccess: async (response) => {
			try {
				const token = response.access_token;

				const res = await axios.post("http://localhost:4000/api/auth/google", {
					token,
				});

				console.log("Login success:", res.data);
				// тут можна зберегти токен у localStorage або змінити стан авторизації
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
