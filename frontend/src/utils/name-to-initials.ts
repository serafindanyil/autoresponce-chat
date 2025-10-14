function nameToInitials(...names: string[]): string {
	const initials = names
		.map((name: string) => name.charAt(0).toUpperCase())
		.join("");
	return initials;
}

export default nameToInitials;
