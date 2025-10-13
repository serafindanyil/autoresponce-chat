import { OAuth2Client } from "google-auth-library";
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

	if (!env.googleClientId || !env.googleClientSecret) {
		res.status(500).json({ message: "Google OAuth not configured" });
		return;
	}

	const googleClient = new OAuth2Client(
		env.googleClientId,
		env.googleClientSecret,
		`${env.baseUrl}/api/auth/google`
	);

	const ticket = await googleClient.verifyIdToken({
		idToken: token,
		audience: env.googleClientId,
	});

	const payload = ticket.getPayload();

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
