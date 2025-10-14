/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--color-background) / <alpha-value>)",
				surface: "hsl(var(--color-surface) / <alpha-value>)",
				foreground: "hsl(var(--color-foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
					foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)",
				},
				secondary: {
					DEFAULT: "hsl(var(--color-secondary) / <alpha-value>)",
					foreground: "hsl(var(--color-secondary-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "hsl(var(--color-muted) / <alpha-value>)",
					foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)",
				},
				accent: {
					DEFAULT: "hsl(var(--color-accent) / <alpha-value>)",
					foreground: "hsl(var(--color-accent-foreground) / <alpha-value>)",
				},
				userMessage: {
					DEFAULT: "hsl(var(--color-user-message) / <alpha-value>)",
					foreground:
						"hsl(var(--color-user-message-foreground) / <alpha-value>)",
				},
				botMessage: {
					DEFAULT: "hsl(var(--color-bot-message) / <alpha-value>)",
					foreground:
						"hsl(var(--color-bot-message-foreground) / <alpha-value>)",
				},
			},
			fontFamily: {
				sans: ["var(--font-sans)", "Inter", "-apple-system", "sans-serif"],
				mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
			},
			borderRadius: {
				DEFAULT: "0.75rem",
			},
			borderColor: {
				DEFAULT: "hsl(var(--color-muted-foreground) / 0.1)",
			},
		},
	},
	plugins: [],
};
