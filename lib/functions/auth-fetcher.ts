import { cookies } from 'next/headers';
import { fetcher } from '@/lib/functions/fetcher';

export async function authFetch<JSON = unknown>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	const cookiesStore = await cookies();
	return fetcher(input, {
		...(init || {}),
		headers: {
			...(init?.headers || {}),
			Cookie: cookiesStore.toString(),
		},
	});
}
