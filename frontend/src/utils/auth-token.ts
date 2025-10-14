import axios from "axios";

const AUTH_HEADER_KEY = "Authorization";

export const applyAuthToken = (token: string | null | undefined) => {
	if (token) {
		axios.defaults.headers.common[AUTH_HEADER_KEY] = `Bearer ${token}`;
		return;
	}

	delete axios.defaults.headers.common[AUTH_HEADER_KEY];
};
