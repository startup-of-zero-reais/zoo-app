import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { Enclosure } from '@/lib/types/entities/enclosure';

const BASE_URL = `${API_DOMAIN}/v1/enclosures`;

interface FetchEnclosuresFilters {
	identification?: string;
}

interface FetchEnclosuresResponse {
	total: number;
	enclosures: Enclosure[];
}

export async function fetchEnclosures({
	identification,
}: FetchEnclosuresFilters = {}) {
	let query = '';
	if (identification) {
		query = `?${encodeURIComponent(identification)}`;
	}

	return authFetch<FetchEnclosuresResponse>(`${BASE_URL}${query}`);
}
