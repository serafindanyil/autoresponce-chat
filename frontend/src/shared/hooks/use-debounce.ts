import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // This will only run when debouncedSearchTerm changes
 *   // and user stops typing for 300ms
 *   fetchResults(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set up timeout to update debounced value
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup function - cancel timeout if value changes
		return () => {
			clearTimeout(timeoutId);
		};
	}, [value, delay]);

	return debouncedValue;
};
