export function extractFormData<F extends string>(
	e: React.FormEvent<HTMLFormElement>,
	fields: F[],
) {
	const formData = new FormData(e.currentTarget);
	const result = {} as Record<F, string>;

	fields.forEach((field) => {
		result[field] = formData.get(field)?.toString() || '';
	});

	return result;
}
