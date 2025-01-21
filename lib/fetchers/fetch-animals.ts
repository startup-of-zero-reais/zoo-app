import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { Animal } from '@/lib/types/entities/animal';

const BASE_URL = `${API_DOMAIN}/v1/animals`;

interface FetchAnimalsParams {
	search?: string;
	rel?: Array<'enclosure' | 'species'>;
}

interface FetchAnimalsResponse {
	total: number;
	animals: Animal[];
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

	return authFetch<FetchAnimalsResponse>(`${BASE_URL}${query}`);
}
