import { z } from 'zod';

const StatusSchema = z.enum([
	'sending',
	'received',
	'processing',
	'completed',
	'error',
]);

const ImportSchema = z.object({
	id: z.string().uuid(),
	filename: z.string(),
	state: StatusSchema,
	upload_id: z.string(),
});

export const FetchImportsResponseSchema = z.object({
	total: z.number().nonnegative(),
	imports: z.array(ImportSchema),
});

const baseImportSchema = z.object({
	id: z.string().uuid(),
	reason: z.string().optional(),
	state_id: z.string().uuid(),
});

const importSpecieSchema = z
	.object({
		common_name: z.string().optional(),
		scientific_name: z.string().optional(),
		taxonomic_order: z.string().optional(),
		kind: z.string().optional(),
	})
	.merge(baseImportSchema);

const importEnclosureSchema = z
	.object({
		identification: z.string().optional(),
	})
	.merge(baseImportSchema);

const importAnimalSchema = z
	.object({
		name: z.string().optional(),
		washer_code: z.string().optional(),
		microchip_code: z.string().optional(),
		landing_at: z.date({ coerce: true }).optional(),
		origin: z.string().optional(),
		born_date: z.date({ coerce: true }).optional(),
		age: z.enum(['Neonato', 'Filhote', 'Jovem', 'Adulto', 'Senil']).optional(),
		gender: z.enum(['Masculino', 'Feminino', 'Indefinido']).optional(),
		observation: z.string().optional(),
	})
	.merge(baseImportSchema);

export const FetchImportRecordsResponseSchema = z.object({
	species: z.array(importSpecieSchema),
	enclosures: z.array(importEnclosureSchema),
	animals: z.array(importAnimalSchema),
});

export type FetchImportsResponse = z.infer<typeof FetchImportsResponseSchema>;
export type FetchImportRecordsResponse = z.infer<
	typeof FetchImportRecordsResponseSchema
>;
