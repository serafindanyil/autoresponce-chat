import { useAppSelector } from "@/shared/store";
import { useLogout } from "./use-logout";

/**
 * Hook for accessing authentication state and logout functionality
 * @returns {Object} Auth state and methods
 * @returns {Object|null} user - Current authenticated user (id, email, name)
 * @returns {string|null} token - JWT token
 * @returns {boolean} isAuthenticated - Whether user is logged in
 * @returns {Function} logout - Logout function
 */
export const useAuth = () => {
	const { user, token } = useAppSelector((state) => state.auth);
	const { logout } = useLogout();

	return {
		user,
		token,
		isAuthenticated: !!token && !!user,
		logout,
	};
};
