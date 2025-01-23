import { z } from 'zod';

export const timestamps = z.object({
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true }),
	deleted_at: z.date({ coerce: true }).nullable(),
});
