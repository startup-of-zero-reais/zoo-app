'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { authActionClient } from './safe-action';

export const importAnimalAction = authActionClient
	.schema(
		z.object({
			type: z.literal('animal'),
			ids: z.array(z.string().uuid()),
		}),
	)
	.action(async ({ parsedInput }) => {
		await authFetch(`${API_DOMAIN}/v1/upload/confirm`, {
			method: 'POST',
			body: JSON.stringify(parsedInput),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		revalidatePath('/dashboard/import/[id]', 'page');
		return { success: true };
	});
