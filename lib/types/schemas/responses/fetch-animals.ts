import { z } from 'zod';
import { AnimalSchema, WeightSchema } from '@/lib/types/schemas/animal.schema';

export const FetchAnimalsResponseSchema = z.object({
	total: z.number(),
	animals: z.array(AnimalSchema),
});

export const FetchAnimalWeightsResponseSchema = z.object({
	total: z.number(),
	weights: z.array(WeightSchema),
});

export type FetchAnimalsResponse = z.infer<typeof FetchAnimalsResponseSchema>;
export type FetchAnimalWeightsResponse = z.infer<
	typeof FetchAnimalWeightsResponseSchema
>;
