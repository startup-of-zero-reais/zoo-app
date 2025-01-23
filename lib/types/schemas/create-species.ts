import { z } from 'zod';

const COMMON_NAME_REQUIRED =
	'O campo "Nome popular" é necessário para continuar.';
const CIENTIFIC_NAME_REQUIRED =
	'O campo "Nome científico" é necessário para continuar.';
const KIND_REQUIRED = 'O campo "Classe" é necessário para continuar.';
const ORDER_REQUIRED = 'O campo "Ordem" é necessário para continuar.';

export const CreateSpeciesSchema = z.object({
	common_name: z
		.string({ required_error: COMMON_NAME_REQUIRED })
		.min(2, COMMON_NAME_REQUIRED),
	scientific_name: z
		.string({ required_error: CIENTIFIC_NAME_REQUIRED })
		.min(2, CIENTIFIC_NAME_REQUIRED),
	kind: z.string({ required_error: KIND_REQUIRED }).min(2, KIND_REQUIRED),
	taxonomic_order: z
		.string({ required_error: ORDER_REQUIRED })
		.min(2, ORDER_REQUIRED),
});

export type CreateSpecies = z.infer<typeof CreateSpeciesSchema>;
