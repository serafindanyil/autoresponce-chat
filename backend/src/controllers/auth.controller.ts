import { OAuth2Client, type TokenPayload } from "google-auth-library";
import axios from "axios";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { env } from "@/config/env";
import { UserModel } from "@/models";
import { ensureDefaultChats } from "@/services/chat.service";

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

	if (!payload) {
		res.status(400).json({ message: "Failed to verify Google token" });
		return;
	}

	if (!payload.email || !payload.sub) {
		res.status(400).json({ message: "Invalid Google token payload" });
		return;
	}

	const userDoc = await UserModel.findOneAndUpdate(
		{ email: payload.email, provider: "google" },
		{
			email: payload.email,
			name: payload.name ?? payload.email,
			provider: "google",
			providerId: payload.sub,
			avatarUrl: payload.picture,
		},
		{ upsert: true, new: true, setDefaultsOnInsert: true }
	);

	if (userDoc?._id) {
		await ensureDefaultChats(userDoc._id);
	}

	const jwtPayload = {
		id: userDoc?._id.toString(),
		email: userDoc?.email,
		name: userDoc?.name,
	};

	const authToken = jwt.sign(jwtPayload, env.jwtSecret, { expiresIn: "7d" });

	res.json({ token: authToken, user: jwtPayload });
}

async function resolveTokenPayload(
	token: string
): Promise<TokenPayload | null | undefined> {
	if (env.googleTestToken && token === env.googleTestToken) {
		const issuedAt = Math.floor(Date.now() / 1000);
		const expiresAt = issuedAt + 60 * 480; // 8 hour lifetime for the synthetic token

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

	const payload = await verifyIdToken(token);

	if (payload) {
		return payload;
	}

	return fetchUserInfo(token);
}

async function verifyIdToken(token: string) {
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

async function fetchUserInfo(token: string) {
	try {
		const { data } = await axios.get<
			Pick<TokenPayload, "email" | "name" | "sub" | "picture">
		>("https://www.googleapis.com/oauth2/v3/userinfo", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return {
			email: data.email,
			name: data.name,
			sub: data.sub,
			picture: data.picture,
		} as TokenPayload;
	} catch (error) {
		return undefined;
	}
}
