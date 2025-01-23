import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import {
	FetchEnclosuresResponse,
	FetchEnclosuresResponseSchema,
} from '@/lib/types/schemas/responses/fetch-enclosures';

const BASE_URL = `${API_DOMAIN}/v1/enclosures`;

interface FetchEnclosuresFilters {
	identification?: string;
}

export async function fetchEnclosures({
	identification,
}: FetchEnclosuresFilters = {}) {
	let query = '';
	if (identification) {
		query = `?${encodeURIComponent(identification)}`;
	}

	return authFetch<FetchEnclosuresResponse>(`${BASE_URL}${query}`).then(
		FetchEnclosuresResponseSchema.parse,
	);
}
