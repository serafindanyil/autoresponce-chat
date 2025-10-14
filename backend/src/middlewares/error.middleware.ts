import type { NextFunction, Request, Response } from "express";
import { logError } from "@/utils/logger";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logError("Unhandled error", { err });

  res.status(500).json({ message: "Internal Server Error" });
}
