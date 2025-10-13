import type { Request, Response, NextFunction } from "express";
import type { ZodError, ZodIssue, ZodSchema } from "zod";

export function validateBody<T>(schema: ZodSchema<T>) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body ?? {});

		if (!result.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: formatZodErrors(result.error),
			});
		}

		req.body = result.data as unknown as Request["body"];
		next();
	};
}

export function validateQuery<T>(schema: ZodSchema<T>) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.query ?? {});

		if (!result.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: formatZodErrors(result.error),
			});
		}

		req.query = result.data as unknown as Request["query"];
		next();
	};
}

function formatZodErrors(error: ZodError<unknown>) {
	const formErrors: string[] = [];
	const fieldErrors: Record<string, string[]> = {};

	error.issues.forEach((issue: ZodIssue) => {
		const path = issue.path.filter(Boolean).join(".");

		if (!path) {
			formErrors.push(issue.message);
			return;
		}

		if (!fieldErrors[path]) {
			fieldErrors[path] = [];
		}

		fieldErrors[path].push(issue.message);
	});

	return { formErrors, fieldErrors };
}
