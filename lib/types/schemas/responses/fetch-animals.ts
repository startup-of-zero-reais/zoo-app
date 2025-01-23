import { z } from 'zod';
import { AnimalSchema } from '@/lib/types/schemas/animal.schema';

export const FetchAnimalsResponseSchema = z.object({
	total: z.number(),
	animals: z.array(AnimalSchema),
});

export type FetchAnimalsResponse = z.infer<typeof FetchAnimalsResponseSchema>;
