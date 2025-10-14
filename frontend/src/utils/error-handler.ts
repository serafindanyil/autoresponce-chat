import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Extract user-friendly error message from RTK Query error
 * @param error - Error from RTK Query mutation
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
	// RTK Query FetchBaseQueryError
	if (error && typeof error === "object" && "status" in error) {
		const fetchError = error as FetchBaseQueryError;

		if ("data" in fetchError && fetchError.data) {
			// Backend validation errors
			if (typeof fetchError.data === "object" && "message" in fetchError.data) {
				return String(fetchError.data.message);
			}

			// Other backend errors
			return JSON.stringify(fetchError.data);
		}

		// HTTP status errors
		if ("error" in fetchError) {
			return String(fetchError.error);
		}

		return `Request failed with status ${fetchError.status}`;
	}

	// RTK Query SerializedError
	if (error && typeof error === "object" && "message" in error) {
		return String(error.message);
	}

	// Unknown error
	return "An unexpected error occurred. Please try again.";
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
	if (!error || typeof error !== "object" || !("status" in error)) {
		return false;
	}

	const status = (error as FetchBaseQueryError).status;
	return status === "FETCH_ERROR" || status === "PARSING_ERROR";
};

/**
 * Check if error is a validation error (400)
 */
export const isValidationError = (error: unknown): boolean => {
	if (!error || typeof error !== "object" || !("status" in error)) {
		return false;
	}

	return (error as FetchBaseQueryError).status === 400;
};

/**
 * Check if error is unauthorized (401)
 */
export const isUnauthorizedError = (error: unknown): boolean => {
	if (!error || typeof error !== "object" || !("status" in error)) {
		return false;
	}

	return (error as FetchBaseQueryError).status === 401;
};

/**
 * Check if error is not found (404)
 */
export const isNotFoundError = (error: unknown): boolean => {
	if (!error || typeof error !== "object" || !("status" in error)) {
		return false;
	}

	return (error as FetchBaseQueryError).status === 404;
};
