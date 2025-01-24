import { z } from 'zod';
import { timestamps } from './base';
import { SpeciesSchema } from './species.schema';
import { EnclosureSchema } from './enclosure.schema';
import { UserSchema } from './user.schema';

export const animalGendersSchema = z.enum(['male', 'female', 'undefined'], {
	required_error: 'Informe o "Gênero" do animal',
	invalid_type_error: '"Gênero" não reconhecido',
	message: 'Informe o "Gênero" do animal',
});

export const animalAgeSchema = z
	.enum(['neonate', 'cub', 'young', 'adult', 'senile'], {
		required_error: 'Informe a "Idade" do animal',
		invalid_type_error: '"Idade" do animal não reconhecida',
		message: 'Informe a "Idade" do animal',
	})
	.optional();

const baseWeightSchema = z
	.object({
		id: z.string().uuid(),
		weight: z.number(),
		animal_id: z.string().uuid(),
		user_id: z.string().uuid(),
	})
	.merge(timestamps);

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
		species_id: z.string(),
		enclosure_id: z.string(),

		weights: z.array(baseWeightSchema).optional(),
		species: SpeciesSchema.optional(),
		enclosure: EnclosureSchema.optional(),
	})
	.merge(timestamps);

export const WeightSchema = z
	.object({
		animal: AnimalSchema.optional(),
		user: UserSchema.optional(),
	})
	.merge(baseWeightSchema)
	.merge(timestamps);

export type Animal = z.infer<typeof AnimalSchema> & { weights?: Weight[] };
export type AnimalGender = z.infer<typeof animalGendersSchema>;
export type AnimalAges = z.infer<typeof animalAgeSchema>;
export type Weight = z.infer<typeof WeightSchema>;
