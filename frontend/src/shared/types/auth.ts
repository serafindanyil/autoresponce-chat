export type AuthUser = {
	id: string;
	email: string;
	name: string;
};

export type AuthPayload = {
	token: string;
	user: AuthUser;
};

export type AuthState = {
	token: string | null;
	user: AuthUser | null;
};
