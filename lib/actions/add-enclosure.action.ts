'use server';

import { z } from 'zod';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { authActionClient } from './safe-action';

export const addEnclosureAction = authActionClient
	.schema(
		z.object({
			identifier: z
				.string()
				.min(2, 'O campo "Recinto" é necessário para continuar.'),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { identifier } = parsedInput;

		const body = new FormData();
		body.append('identifier', identifier);

		await authFetch(`${API_DOMAIN}/v1/enclosures`, {
			method: 'POST',
			body,
		});

		return { success: true };
	});
