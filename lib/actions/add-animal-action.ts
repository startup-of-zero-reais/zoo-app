'use server';

import { z } from 'zod';
import { authFetch } from '@/lib/functions/auth-fetcher';
import { API_DOMAIN } from '@/lib/constants/main';
import { authActionClient } from './safe-action';

const MICROCHIP = 'microchip';
const WASHER = 'anilha';
const MARK_TYPE = {
	[MICROCHIP]: MICROCHIP,
	[WASHER]: 'washer',
};

export const addAnimalAction = authActionClient
	.schema(
		z.object({
			name: z.string().min(1, 'O campo "Nome" é necessário para continuar.'),
			mark_type: z.enum(['microchip', 'anilha'], {
				message: 'Selecione o tipo de marcação para continuar.',
				required_error: 'Selecione o tipo de marcação para continuar.',
			}),
			mark_num: z
				.string()
				.min(1, 'O campo "marcação" é necessário para continuar.'),
			entry_date: z.date({
				required_error: 'Informe a "Data de chegada" do animal.',
				message: 'A "Data de chegada" deve ser uma data correta.',
				coerce: true,
			}),
			origin: z
				.string()
				.min(1, 'O campo "Origem" deve ser informado para continuar.'),
			animal_born: z.date({
				required_error:
					'Informe a "Idade do animal" ou a "Data de nascimento" para prosseguir.',
				message: 'A "Idade do animal" deve ser uma data válida.',
				coerce: true,
			}),
			species: z
				.string()
				.uuid('A "Espécie" deve ser selecionada para prosseguir.'),
			enclosure: z.string().uuid('O "Recinto" do animal deve ser informado.'),
			weight: z
				.number({
					required_error: 'O "Peso atual" do animal deve ser informado.',
					message: 'O "Peso atual" deve ser um número válido.',
					invalid_type_error: 'O "Peso atual" deve ser um número.',
					coerce: true,
				})
				.nonnegative('O "Peso atual" não pode ser negativo'),
		}),
	)
	.action(async ({ parsedInput }) => {
		const {
			name,
			mark_type,
			mark_num,
			entry_date,
			origin,
			animal_born,
			species,
			enclosure,
			weight,
		} = parsedInput;

		const body = new FormData();
		body.append('name', name);
		body.append('mark_type', MARK_TYPE[mark_type]);
		body.append('mark_number', mark_num);
		body.append('landing_at', entry_date.toISOString());
		body.append('origin', origin);
		body.append('age', animal_born.toISOString());
		body.append('species_id', species);
		body.append('enclosure_id', enclosure);
		body.append('weight', `${weight}`);

		await authFetch(`${API_DOMAIN}/v1/animals`, {
			method: 'POST',
			body,
		});

		return { success: true };
	});
