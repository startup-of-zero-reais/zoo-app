import { z } from 'zod';

export const Taxonomy = z.object({
	commonName: z.string(),
	scientificName: z.string(),
	taxonomicClass: z.string(),
	taxonomicOrder: z.string(),
});

export type TaxonomyResponse = z.infer<typeof Taxonomy>;
