import { z } from 'zod';
import { SpeciesSchema } from '@/lib/types/schemas/species.schema';

export const FetchSpeciesResponseSchema = z.object({
	total: z.number(),
	species: z.array(SpeciesSchema),
});

export type FetchSpeciesResponse = z.infer<typeof FetchSpeciesResponseSchema>;
