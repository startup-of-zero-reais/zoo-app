import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { Species } from '@/lib/types/entities/species';

const BASE_URL = `${API_DOMAIN}/v1/species`;

interface FetchSpeciesParams {
	search?: string;
}

interface FetchSpeciesResponse {
	total: number;
	species: Species[];
}

export async function fetchSpecies({ search }: FetchSpeciesParams = {}) {
	let query = '';
	if (search) {
		query = `?search=${search}`;
	}

	return authFetch<FetchSpeciesResponse>(`${BASE_URL}${query}`);
}
