import { OAuth2Client, type TokenPayload } from "google-auth-library";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { env } from "@/config/env";
import { UserModel } from "@/models";

export async function googleAuthCallback(
	req: Request,
	res: Response
): Promise<void> {
	const { token } = req.body as { token?: string };

	if (!token) {
		res.status(400).json({ message: "Missing token" });
		return;
	}

	const payload = await resolveTokenPayload(token);

	if (payload === null) {
		res.status(500).json({ message: "Google OAuth not configured" });
		return;
	}

	if (!payload?.email || !payload.sub) {
		res.status(400).json({ message: "Invalid Google token" });
		return;
	}

	const user = await UserModel.findOneAndUpdate(
		{ email: payload.email, provider: "google" },
		{
			email: payload.email,
			name: payload.name ?? payload.email,
			provider: "google",
			providerId: payload.sub,
			avatarUrl: payload.picture,
		},
		{ upsert: true, new: true, setDefaultsOnInsert: true }
	).lean();

	const jwtPayload = {
		id: user?._id,
		email: user?.email,
		name: user?.name,
	};

	const authToken = jwt.sign(jwtPayload, env.jwtSecret, { expiresIn: "7d" });

	res.json({ token: authToken, user: jwtPayload });
}

async function resolveTokenPayload(
	token: string
): Promise<TokenPayload | null | undefined> {
	if (env.googleTestToken && token === env.googleTestToken) {
		const issuedAt = Math.floor(Date.now() / 1000);
		const expiresAt = issuedAt + 60 * 60; // 1 hour lifetime for the synthetic token

		return {
			iss: "https://accounts.google.com",
			aud: env.googleClientId ?? "test-google-client",
			iat: issuedAt,
			exp: expiresAt,
			email: env.googleTestUserEmail ?? "test.user@example.com",
			sub: env.googleTestUserId ?? "google-test-user",
			name: env.googleTestUserName ?? env.googleTestUserEmail ?? "Test User",
			picture: env.googleTestUserAvatar,
		} as TokenPayload;
	}

	if (!env.googleClientId || !env.googleClientSecret) {
		return null;
	}

	const googleClient = new OAuth2Client(
		env.googleClientId,
		env.googleClientSecret,
		`${env.baseUrl}/api/auth/google`
	);

	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: token,
			audience: env.googleClientId,
		});

		return ticket.getPayload() ?? undefined;
	} catch (error) {
		return undefined;
	}
}
