'use server';

import { format } from 'date-fns';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { CreateAnimalSchema } from '@/lib/types/schemas/create-animal';
import { authActionClient } from './safe-action';

const DATE_RFC3339_FORMAT = "yyyy-MM-dd'T'hh:mm:ss'Z'";

export const addAnimalAction = authActionClient
	.schema(CreateAnimalSchema)
	.action(async ({ parsedInput }) => {
		const {
			name,
			washer_code,
			microchip_code,
			entry_date,
			origin,
			born_date,
			age,
			gender,
			species,
			observation,
			enclosure,
			weight,
		} = parsedInput;

		const body = new FormData();

		if (name) {
			body.append('name', name);
		}

		if (washer_code) {
			body.append('washer_code', washer_code);
		}

		if (microchip_code) {
			body.append('microchip_code', microchip_code);
		}

		if (origin) {
			body.append('origin', origin);
		}

		if (age) {
			body.append('age', age);
		}

		if (born_date) {
			body.append('born_date', format(born_date, DATE_RFC3339_FORMAT));
		}

		if (observation) {
			body.append('observation', observation);
		}

		body.append('gender', gender);
		body.append('landing_at', format(entry_date, DATE_RFC3339_FORMAT));
		body.append('species_id', species);
		body.append('enclosure_id', enclosure);
		body.append('weight', `${weight}`);

		await authFetch(`${API_DOMAIN}/v1/animals`, {
			method: 'POST',
			body,
		});

		return { success: true };
	});
