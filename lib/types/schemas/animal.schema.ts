import { z } from 'zod';
import { timestamps } from './base';
import { SpeciesSchema } from './species.schema';
import { EnclosureSchema } from './enclosure.schema';

export const animalGendersSchema = z.enum(['male', 'female', 'undefined'], {
	required_error: 'Informe o "Gênero" do animal',
	invalid_type_error: '"Gênero" não reconhecido',
});

export const animalAgeSchema = z
	.enum(['neonate', 'cub', 'young', 'adult', 'senile'])
	.optional();

export const AnimalSchema = z
	.object({
		id: z.string().uuid(),
		name: z.string().optional(),
		microchip_code: z.string().optional(),
		washer_code: z.string().optional(),
		landing_at: z.date({ coerce: true }),
		origin: z.string(),
		age: animalAgeSchema,
		born_date: z.date({ coerce: true }),
		gender: animalGendersSchema,
		weight: z.number().optional(),
		species_id: z.string(),
		enclosure_id: z.string(),

		species: SpeciesSchema.optional(),
		enclosure: EnclosureSchema.optional(),
	})
	.merge(timestamps);

export type Animal = z.infer<typeof AnimalSchema>;
export type AnimalGender = z.infer<typeof animalGendersSchema>;
export type AnimalAges = z.infer<typeof animalAgeSchema>;
