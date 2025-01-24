import { z } from 'zod';

const WEIGHT_REQUIRED = 'Forneça o "Peso" do animal para registro.';
const WEIGHT_INVALID = 'O peso deve ser um número válido';
const WEIGHT_MUST_BE_POSITIVE = 'O "Peso" deve ser um valor positivo';

export const CreateAnimalWeightSchema = z.object({
	weight: z
		.number({
			message: WEIGHT_REQUIRED,
			required_error: WEIGHT_REQUIRED,
			invalid_type_error: WEIGHT_INVALID,
			coerce: true,
		})
		.positive(WEIGHT_MUST_BE_POSITIVE),
	animal_id: z.string().uuid(),
});
