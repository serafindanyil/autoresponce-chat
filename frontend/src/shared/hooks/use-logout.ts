import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCredentials } from "@/shared/store/auth-slice";
import { clearChats } from "@/shared/store/chat-slice";
import { useLogoutMutation } from "@/shared/services/api.service";
import { socketService } from "@/shared/services/socket.service";

export const useLogout = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [logoutMutation, { isLoading }] = useLogoutMutation();

	const logout = async () => {
		try {
			await logoutMutation().unwrap();
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			socketService.disconnect();
			dispatch(clearCredentials());
			dispatch(clearChats());
			router.push("/auth");
		}
	};

	return { logout, isLoading };
};
