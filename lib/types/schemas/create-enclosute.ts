import { z } from 'zod';

const IDENTIFIER_REQUIRED = 'O campo "Recinto" é necessário para continuar.';

export const CreateEnclosureSchema = z.object({
	identifier: z
		.string({
			required_error: IDENTIFIER_REQUIRED,
			invalid_type_error: IDENTIFIER_REQUIRED,
		})
		.min(2, IDENTIFIER_REQUIRED),
});

export type CreateEnclosure = z.infer<typeof CreateEnclosureSchema>;
