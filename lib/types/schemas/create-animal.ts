import { z } from 'zod';
import { animalAgeSchema, animalGendersSchema } from './animal.schema';

export const CreateAnimalSchema = z
	.object({
		name: z.string().optional(),
		washer_code: z.string().optional(),
		microchip_code: z.string().optional(),
		entry_date: z.date({
			required_error: 'Informe a "Data de chegada" do animal.',
			message: 'A "Data de chegada" deve ser uma data correta.',
			coerce: true,
		}),
		origin: z.string().optional(),
		born_date: z
			.date({
				required_error:
					'Informe a "Idade do animal" ou a "Data de nascimento" para prosseguir.',
				message: 'A "Idade do animal" deve ser uma data válida.',
				coerce: true,
			})
			.optional(),
		age: animalAgeSchema,
		gender: animalGendersSchema,
		species: z
			.string({
				required_error: 'A "Espécie" deve ser selecionada para prosseguir.',
			})
			.uuid('A "Espécie" deve ser selecionada para prosseguir.'),
		enclosure: z.string().uuid('O "Recinto" do animal deve ser informado.'),
		observation: z.string().optional(),
		weight: z
			.number({
				required_error: 'O "Peso atual" do animal deve ser informado.',
				message: 'O "Peso atual" deve ser um número válido.',
				invalid_type_error: 'O "Peso atual" deve ser um número.',
				coerce: true,
			})
			.nonnegative('O "Peso atual" não pode ser negativo'),
	})
	.refine(
		(schema) => {
			if (!schema.age && !schema.born_date) {
				return false;
			}

			return true;
		},
		{
			message: 'Informe uma faixa etária ou uma data de nascimento',
			path: ['age'],
		},
	);

export type CreateAnimal = z.infer<typeof CreateAnimalSchema>;
