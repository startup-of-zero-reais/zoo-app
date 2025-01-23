'use server';

import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { CreateSpeciesSchema } from '@/lib/types/schemas/create-species';
import { authActionClient } from './safe-action';

export const addSpeciesAction = authActionClient
	.schema(CreateSpeciesSchema)
	.action(async ({ parsedInput }) => {
		const { common_name, scientific_name, kind, taxonomic_order } = parsedInput;

		const body = new FormData();
		body.append('common_name', common_name);
		body.append('scientific_name', scientific_name);
		body.append('kind', kind);
		body.append('taxonomic_order', taxonomic_order);

		await authFetch(`${API_DOMAIN}/v1/species`, {
			method: 'POST',
			body,
		});

		return { success: true };
	});
