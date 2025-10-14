export function logInfo(message: string, meta?: Record<string, unknown>): void {
	console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ?? "");
}

export function logError(
	message: string,
	meta?: Record<string, unknown>
): void {
	console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta ?? "");
}
