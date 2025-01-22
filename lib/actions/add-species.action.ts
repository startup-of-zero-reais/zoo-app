'use server';

import { z } from 'zod';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { authActionClient } from './safe-action';

const COMMON_NAME_REQUIRED =
	'O campo "Nome popular" é necessário para continuar.';
const CIENTIFIC_NAME_REQUIRED =
	'O campo "Nome científico" é necessário para continuar.';
const KIND_REQUIRED = 'O campo "Classe" é necessário para continuar.';
const ORDER_REQUIRED = 'O campo "Ordem" é necessário para continuar.';

export const addSpeciesAction = authActionClient
	.schema(
		z.object({
			common_name: z
				.string({ required_error: COMMON_NAME_REQUIRED })
				.min(2, COMMON_NAME_REQUIRED),
			cientific_name: z
				.string({ required_error: CIENTIFIC_NAME_REQUIRED })
				.min(2, CIENTIFIC_NAME_REQUIRED),
			kind: z.string({ required_error: KIND_REQUIRED }).min(2, KIND_REQUIRED),
			taxonomic_order: z
				.string({ required_error: ORDER_REQUIRED })
				.min(2, ORDER_REQUIRED),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { common_name, cientific_name, kind, taxonomic_order } = parsedInput;

		const body = new FormData();
		body.append('common_name', common_name);
		body.append('cientific_name', cientific_name);
		body.append('kind', kind);
		body.append('taxonomic_order', taxonomic_order);

		await authFetch(`${API_DOMAIN}/v1/species`, {
			method: 'POST',
			body,
		});

		return { success: true };
	});
