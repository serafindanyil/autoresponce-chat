import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export interface AuthenticatedUser {
	readonly id: string;
	readonly email: string;
	readonly name: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthenticatedUser;
		}
	}
}

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.split(" ")[1]
		: undefined;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const payload = jwt.verify(token, env.jwtSecret) as AuthenticatedUser;
		req.user = payload;
		return next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
}
