'use server';

import { revalidatePath } from 'next/cache';
import { CreateAnimalWeightSchema } from '@/lib/types/schemas/create-animal-weight';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { authActionClient } from './safe-action';

export const addAnimalWeightAction = authActionClient
	.schema(CreateAnimalWeightSchema)
	.action(async ({ parsedInput }) => {
		const { animal_id, weight } = parsedInput;

		const body = new FormData();
		body.append('weight', weight.toString());

		await authFetch(`${API_DOMAIN}/v1/animals/${animal_id}/weights`, {
			method: 'POST',
			body,
		});

		revalidatePath('/dashboard/@modal/[id]/peso', 'page');
		return { success: true };
	});
