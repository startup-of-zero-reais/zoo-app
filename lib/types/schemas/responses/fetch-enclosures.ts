import { z } from 'zod';
import { EnclosureSchema } from '@/lib/types/schemas/enclosure.schema';

export const FetchEnclosuresResponseSchema = z.object({
	total: z.number(),
	enclosures: z.array(EnclosureSchema),
});

export type FetchEnclosuresResponse = z.infer<
	typeof FetchEnclosuresResponseSchema
>;
