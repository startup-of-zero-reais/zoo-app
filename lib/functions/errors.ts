import { toast } from 'sonner';

type Result =
	| {
			validationErrors?: {
				[field: string]: {
					_errors: string | string[];
				};
			};
	  }
	| {
			serverError?: {
				serverError: string;
			};
	  };

export function handleServerErrors(result: Result = {}) {
	console.log({ result });
	if (!result) {
		return { proceed: false };
	}

	if ('serverError' in result) {
		return { proceed: false };
	}

	if (!('validationErrors' in result)) {
		return { proceed: true };
	}

	const hasValidationErrors =
		Object.values(result.validationErrors || {}).length > 0;

	if (hasValidationErrors) {
		const error = Object.values(result.validationErrors || {}).at(0);
		if (!error) {
			return { proceed: false };
		}

		if (!Array.isArray(error)) {
			toast.error(error?._errors?.at(0));
		}

		return { proceed: false };
	}

	return {
		proceed: true,
	};
}
