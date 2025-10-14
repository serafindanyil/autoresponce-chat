import axios from "axios";

interface QuoteResponse {
	readonly content: string;
	readonly author: string;
}

const QUOTE_URL = "https://api.quotable.io/random";

export async function fetchQuote(): Promise<QuoteResponse> {
	const response = await axios.get<QuoteResponse>(QUOTE_URL, {
		timeout: 5000,
	});

	return response.data;
}
