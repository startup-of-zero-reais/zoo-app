import { z } from 'zod';
import { timestamps } from './base';

export const SpeciesSchema = z
	.object({
		id: z.string().uuid(),
		scientific_name: z.string(),
		common_name: z.string(),
		kind: z.string(),
		taxonomic_order: z.string(),
	})
	.merge(timestamps);

export type Species = z.infer<typeof SpeciesSchema>;
