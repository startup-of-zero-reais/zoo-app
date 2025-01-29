import { z } from 'zod';
import { timestamps } from './base';

export const UserSchema = z
	.object({
		id: z.string().uuid(),
		name: z.string(),
		avatar: z.string().url().nullable(),
		email: z.string().email(),
		email_verified_at: z.date({ coerce: true }).optional(),
	})
	.merge(timestamps);

export type User = z.infer<typeof UserSchema>;
