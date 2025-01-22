import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { TaxonomyResponse } from '@/lib/openai/schemas/species.response';

export function useSpeciesCompletition() {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(null);
	const [data, setData] = useState<TaxonomyResponse | null>(null);

	const onRequest = useCallback(
		async (
			commonName: string,
			cb?: (data: TaxonomyResponse | null) => void,
		) => {
			if (!commonName) {
				toast.error('Para solicitar a IA preencha o nome comum');
				return null;
			}
			setIsLoading(true);

			const body = new FormData();
			body.append('commonName', commonName);

			let value: TaxonomyResponse | null = null;
			await fetch(`/app/api/complete/species`, {
				method: 'POST',
				body,
			})
				.then((res) => {
					if (res.ok) {
						return res.json() as Promise<TaxonomyResponse>;
					}

					return null;
				})
				.then((prompt) => {
					value = prompt;
					setData(prompt);
				})
				.catch((err) => {
					setIsError(err.message);
				})
				.finally(() => {
					setIsLoading(false);
					cb?.(value);
				});
		},
		[],
	);

	return {
		isLoading,
		isError,
		data,
		onRequest,
	};
}
