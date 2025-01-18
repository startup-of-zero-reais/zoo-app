import { API_DOMAIN } from '@/lib/constants/main';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { User } from '@/lib/types/entities/user';

const AUTH_PATH = '/v1/auth';
const BASE_URL = `${API_DOMAIN}${AUTH_PATH}`;

export async function fetchMe() {
	return authFetch<User>(`${BASE_URL}/me`);
}

export async function logout() {
	return authFetch<void>(`${BASE_URL}/logout`).catch(() => null);
}
