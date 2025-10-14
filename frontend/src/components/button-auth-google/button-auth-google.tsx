"use client";

import axios from "axios";

import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

import useAppDispatch from "@/shared/hooks/use-app-dispatch";
import { setCredentials } from "@/shared/store/auth-slice";
import type { AuthPayload } from "@/shared/types";
import Button from "@/ui/button/button";
import { applyAuthToken } from "@/utils/auth-token";

const DEFAULT_AUTH_ENDPOINT = "http://localhost:4000/api/auth/google";

const ButtonAuthGoogle = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const authEndpoint =
		process.env.NEXT_PUBLIC_AUTH_URL ?? DEFAULT_AUTH_ENDPOINT;

	const login = useGoogleLogin({
		scope: "openid email profile",
		prompt: "select_account",
		onSuccess: async (tokenResponse) => {
			const accessToken = tokenResponse.access_token;
			const idToken = (tokenResponse as { id_token?: string }).id_token;

			try {
				const tokenToSend = idToken ?? accessToken;

				if (!tokenToSend) {
					console.error("Google login did not return a usable token");
					return;
				}

				const { data } = await axios.post<AuthPayload>(
					authEndpoint,
					{ token: tokenToSend },
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (data?.token && data?.user) {
					dispatch(setCredentials(data));
					applyAuthToken(data.token);
				}

				router.push("/");
			} catch (error) {
				if (axios.isAxiosError(error)) {
					console.error(
						"Backend error:",
						error.response?.data ?? error.message
					);
				} else {
					console.error("Backend error:", error);
				}
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
