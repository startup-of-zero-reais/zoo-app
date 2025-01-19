'use server';

import { z } from 'zod';
import { authActionClient } from './safe-action';

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
		console.log(parsedInput);

		await new Promise((resolve) => setTimeout(resolve, 10000));

		return { success: true };
	});
