interface SWRError extends Error {
	status: number;
}

export async function fetcher<JSON = unknown>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	const response = await fetch(input, init);

	if (!response.ok) {
		const error = await response.text();
		const err = new Error(error) as SWRError;
		err.status = response.status;
		throw err;
	}

	return response.json();
}
