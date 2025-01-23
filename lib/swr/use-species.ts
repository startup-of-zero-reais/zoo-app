'use client';

import useSWR from 'swr';
import { API_DOMAIN } from '@/lib/constants/main';
import { fetcherWithCookies } from '@/lib/functions/fetcher';
import { FetchSpeciesResponse } from '@/lib/types/schemas/responses/fetch-species';

const BASE_URL = `${API_DOMAIN}/v1/species`;

export function useSpecies(search: string) {
	const path = search ? [`${BASE_URL}?search=${search}`] : [BASE_URL];

	const { data, error, isValidating } = useSWR<FetchSpeciesResponse>(
		path,
		fetcherWithCookies,
		{
			dedupingInterval: 5000, // Evita refetch
			revalidateOnFocus: false, // Nao refaz a busca ao reabrir a aba
			revalidateOnReconnect: false, // Nao refaz a busca se a internet cair
		},
	);

	return {
		species: data || { total: 0, species: [] },
		isLoading: isValidating,
		isError: error,
	};
}
