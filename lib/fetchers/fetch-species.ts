import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import {
	FetchSpeciesResponse,
	FetchSpeciesResponseSchema,
} from '@/lib/types/schemas/responses/fetch-species';

const BASE_URL = `${API_DOMAIN}/v1/species`;

interface FetchSpeciesParams {
	search?: string;
}

export async function fetchSpecies({ search }: FetchSpeciesParams = {}) {
	let query = '';
	if (search) {
		query = `?search=${search}`;
	}

	return authFetch<FetchSpeciesResponse>(`${BASE_URL}${query}`).then(
		FetchSpeciesResponseSchema.parse,
	);
}
