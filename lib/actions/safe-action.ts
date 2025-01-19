import { createSafeActionClient } from 'next-safe-action';
import { auth } from '@/lib/functions/auth';

export const actionClient = createSafeActionClient({
	handleServerError(error) {
		if (error instanceof Error) {
			return {
				serverError: error.message,
			};
		}

		return {
			serverError: 'Erro desconhecido.',
		};
	},
});

export const authActionClient = actionClient.use(async ({ next }) => {
	const user = await auth().getUser();

	if (!user) {
		throw new Error('Não autorizado: Faça login novamente.');
	}

	return next({ ctx: { user } });
});
