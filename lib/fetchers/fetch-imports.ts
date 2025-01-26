import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import {
	FetchImportRecordsResponse,
	FetchImportRecordsResponseSchema,
	FetchImportsResponse,
	FetchImportsResponseSchema,
} from '@/lib/types/schemas/responses/fetch-imports';

const BASE_URL = `${API_DOMAIN}/v1/upload/imports`;

export async function fetchImports() {
	return authFetch<FetchImportsResponse>(`${BASE_URL}`).then(
		FetchImportsResponseSchema.parse,
	);
}

export async function fetchImportRecords(id: string) {
	return authFetch<FetchImportRecordsResponse>(`${BASE_URL}/${id}`).then(
		FetchImportRecordsResponseSchema.parse,
	);
}
