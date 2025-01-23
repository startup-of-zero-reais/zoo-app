import { z } from 'zod';
import { timestamps } from './base';

export const EnclosureSchema = z
	.object({
		id: z.string(),
		identification: z.string(),
	})
	.merge(timestamps);

export type Enclosure = z.infer<typeof EnclosureSchema>;
