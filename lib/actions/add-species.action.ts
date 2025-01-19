'use server';

import { z } from 'zod';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { authActionClient } from './safe-action';

export const addSpeciesAction = authActionClient
	.schema(
		z.object({
			common_name: z
				.string()
				.min(2, 'O campo "Nome popular" é necessário para continuar.'),
			cientific_name: z
				.string()
				.min(2, 'O campo "Nome científico" é necessário para continuar.'),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { common_name, cientific_name } = parsedInput;

		const body = new FormData();
		body.append('common_name', common_name);
		body.append('cientific_name', cientific_name);

		await authFetch(`${API_DOMAIN}/v1/species`, {
			method: 'POST',
			body,
		});

		return { success: true };
	});
