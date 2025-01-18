import {
	RequestCookie,
	ResponseCookie,
} from 'next/dist/compiled/@edge-runtime/cookies';
import { User } from '@/lib/types/entities/user';
import { API_DOMAIN } from '@/lib/constants/main';
import { SESSION_TOKEN } from '@/lib/constants/auth';

interface CreateServerClientOptions {
	cookies: {
		getAll(): RequestCookie[];
		setAll(
			cookies: Array<{
				name: string;
				value: string;
				options: Partial<ResponseCookie>;
			}>,
		): void;
	};
}

export function createServerClient(options: CreateServerClientOptions) {
	const { getAll } = options.cookies;
	const cookies = getAll();
	const session = cookies.find((a) => a.name === SESSION_TOKEN);

	async function getUser(): Promise<
		{ user: User; error: null } | { user: null; error: string }
	> {
		if (!session) {
			console.error('Missing session token');
			return {
				user: null,
				error: 'Missing session token',
			};
		}

		const response = await fetch(`${API_DOMAIN}/v1/auth/me`, {
			keepalive: true,
			headers: {
				Authorization: `Bearer ${session.value}`,
			},
		})
			.then(async (res) => {
				if (!res.ok) {
					const textBuffer = await res.text();
					console.log('Request was not ok', textBuffer.substring(0, 256));
					return null;
				}

				res.headers.getSetCookie().map((cookie) => {
					const [name, value] = cookie.split('=');
					return { name, value };
				});
				return res.json();
			})
			.catch((err) => {
				console.error('Failed to get session', err);
				return null;
			});

		if (!response) {
			return {
				user: null,
				error: 'Unauthorized',
			};
		}

		return {
			user: response as User,
			error: null,
		};
	}

	return {
		auth: {
			getUser,
		},
	};
}
