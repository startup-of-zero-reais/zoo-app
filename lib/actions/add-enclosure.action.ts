'use server';

import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { CreateEnclosureSchema } from '@/lib/types/schemas/create-enclosute';
import { authActionClient } from './safe-action';

export const addEnclosureAction = authActionClient
	.schema(CreateEnclosureSchema)
	.action(async ({ parsedInput }) => {
		const { identifier } = parsedInput;

		const body = new FormData();
		body.append('identification', identifier);

		await authFetch(`${API_DOMAIN}/v1/enclosures`, {
			method: 'POST',
			body,
		});

		return { success: true };
	});
