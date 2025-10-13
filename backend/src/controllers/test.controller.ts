import type { Request, Response } from "express";
import { UserModel } from "@/models";

export async function getTestMessage(_: Request, res: Response): Promise<void> {
	const totalUsers = await UserModel.countDocuments();

	res.json({
		status: "ok",
		message: "Test endpoint is reachable.",
		totalUsers,
	});
}
