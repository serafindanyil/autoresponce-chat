import type { Request, Response } from "express";

export function getTestMessage(_: Request, res: Response): void {
	res.json({ status: "ok", message: "Test endpoint is reachable." });
}
