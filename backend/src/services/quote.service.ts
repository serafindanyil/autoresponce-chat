import axios from "axios";
import https from "https";

interface QuoteResponse {
	readonly content: string;
	readonly author: string;
}

const QUOTE_URL = "https://api.quotable.io/random";

// Fallback quotes for when API is unavailable
const FALLBACK_QUOTES: QuoteResponse[] = [
	{
		content: "The only way to do great work is to love what you do.",
		author: "Steve Jobs",
	},
	{
		content: "Innovation distinguishes between a leader and a follower.",
		author: "Steve Jobs",
	},
	{
		content: "Life is what happens when you're busy making other plans.",
		author: "John Lennon",
	},
	{
		content:
			"The future belongs to those who believe in the beauty of their dreams.",
		author: "Eleanor Roosevelt",
	},
	{
		content:
			"It is during our darkest moments that we must focus to see the light.",
		author: "Aristotle",
	},
	{
		content: "Be yourself; everyone else is already taken.",
		author: "Oscar Wilde",
	},
	{
		content: "The only impossible journey is the one you never begin.",
		author: "Tony Robbins",
	},
	{
		content:
			"Success is not final, failure is not fatal: it is the courage to continue that counts.",
		author: "Winston Churchill",
	},
];

export async function fetchQuote(): Promise<QuoteResponse> {
	try {
		// Create axios instance with SSL verification disabled to handle expired certificates
		const httpsAgent = new https.Agent({
			rejectUnauthorized: false,
		});

		const response = await axios.get<QuoteResponse>(QUOTE_URL, {
			timeout: 5000,
			httpsAgent,
		});

		return response.data;
	} catch (error) {
		// If API fails (SSL, timeout, etc.), return random fallback quote
		const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
		return FALLBACK_QUOTES[randomIndex];
	}
}
