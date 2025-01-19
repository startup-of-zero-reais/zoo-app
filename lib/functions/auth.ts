import { fetchMe } from '@/lib/fetchers/auth';

export function auth() {
	return {
		getUser: fetchMe,
	};
}
