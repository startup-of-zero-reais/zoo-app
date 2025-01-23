import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import {
	FetchAnimalsResponse,
	FetchAnimalsResponseSchema,
	FetchAnimalWeightsResponse,
	FetchAnimalWeightsResponseSchema,
} from '@/lib/types/schemas/responses/fetch-animals';

const BASE_URL = `${API_DOMAIN}/v1/animals`;

interface FetchAnimalsParams {
	search?: string;
	rel?: Array<'enclosure' | 'species'>;
}

export async function fetchAnimals({ search, rel }: FetchAnimalsParams = {}) {
	let query = '';
	const urlQuery = new URLSearchParams();

	if (search) {
		urlQuery.append('search', search);
	}

	if (rel && rel.length > 0) {
		urlQuery.append('rel', rel.toString());
	}

	if (urlQuery.size > 0) {
		query = `?${urlQuery.toString()}`;
	}

	return authFetch<FetchAnimalsResponse>(`${BASE_URL}${query}`).then(
		FetchAnimalsResponseSchema.parse,
	);
}

interface FetchAnimalWeightsParams {
	id: string;
	rel?: Array<'animal.enclosure' | 'animal.species' | 'user'>;
}

export async function fetchAnimalWeights(
	{ id, rel }: FetchAnimalWeightsParams = { id: '' },
) {
	let query = '';
	const urlQuery = new URLSearchParams();

	if (rel) {
		urlQuery.append('rel', rel.toString());
	}

	if (urlQuery.size > 0) {
		query = `?${urlQuery.toString()}`;
	}

	return authFetch<FetchAnimalWeightsResponse>(
		`${BASE_URL}/${id}/weights${query}`,
	).then(FetchAnimalWeightsResponseSchema.parse);
}
