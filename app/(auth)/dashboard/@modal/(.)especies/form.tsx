'use client';

import { useCallback, useState } from 'react';
import { Bot, LoaderCircle, Save, Sparkles } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { addSpeciesAction } from '@/lib/actions/add-species.action';
import { handleServerErrors } from '@/lib/functions/errors';
import { useSpeciesCompletition } from '@/lib/openai/requests/complete-species';
import { extractFormData } from '@/lib/functions/extract-form-data';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useOpenChange } from '@/hooks/use-open-change';

export default function SpeciesForm() {
	const [open, onOpenChange, onClose] = useOpenChange();
	const [commonName, setCommonName] = useState('');
	const [scientificName, setScientificName] = useState('');
	const [taxonomicClass, setTaxonomicClass] = useState('');
	const [taxonomicOrder, setTaxonomicOrder] = useState('');

	const { isLoading: isLoadingCompletition, onRequest } =
		useSpeciesCompletition();

	const { executeAsync, hasSucceeded, isExecuting } = useAction(
		addSpeciesAction,
		{
			onSuccess() {
				console.log(`Espécie criada!`);
			},
			onError({ error }) {
				console.error('Falha ao adicionar espécie', error);
				if (!error.validationErrors) {
					toast.error('Falha ao adicionar espécie, tente novamente.');
				}
			},
		},
	);

	const isLoading = hasSucceeded || isExecuting || isLoadingCompletition;

	const onSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			const { common_name, scientific, order, kind } = extractFormData(e, [
				'common_name',
				'scientific',
				'kind',
				'order',
			]);

			const result = await executeAsync({
				common_name,
				scientific_name: scientific,
				kind,
				taxonomic_order: order,
			});
			const { proceed } = handleServerErrors(result);
			if (!proceed) {
				return;
			}

			toast.success('Adicionado!');
			onClose();
		},
		[executeAsync, onClose],
	);

	const requestCompletition = useCallback(async () => {
		await onRequest(commonName, (prompt) => {
			if (!prompt) {
				return;
			}

			setScientificName(prompt.scientificName);
			setTaxonomicClass(prompt.taxonomicClass);
			setTaxonomicOrder(prompt.taxonomicOrder);
		});
	}, [commonName, onRequest]);

	const onChange = useCallback(
		(cb: (value: string) => void) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				cb(e.target.value);
			},
		[],
	);

	return (
		<Dialog defaultOpen={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Registro de espécie</DialogTitle>
					<DialogDescription>
						Adicione uma espécie aqui. Clique para salvar quando estiver pronto
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<div className="grid grid-cols-[1fr,auto] gap-2 items-end">
						<div>
							<Label htmlFor="common_name">Nome popular</Label>
							<Input
								aria-required
								required
								id="common_name"
								name="common_name"
								type="text"
								placeholder="Leão"
								value={commonName}
								onChange={onChange(setCommonName)}
							/>
						</div>

						<Tooltip
							defaultOpen={!isLoadingCompletition && commonName.length < 3}
						>
							<TooltipTrigger asChild>
								<Button
									type="button"
									onClick={requestCompletition}
									disabled={isLoadingCompletition || commonName.length < 3}
								>
									{isLoadingCompletition ? (
										<LoaderCircle className="animate-spin" />
									) : (
										<Sparkles />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<span className="flex gap-2 items-center">
									<Bot /> Preencher automático com IA
								</span>
							</TooltipContent>
						</Tooltip>
					</div>

					<div>
						<Label htmlFor="scientific">Nome científico</Label>
						<Input
							aria-required
							required
							id="scientific"
							name="scientific"
							type="text"
							placeholder="Panthera leo"
							value={scientificName}
							onChange={onChange(setScientificName)}
							disabled={isLoadingCompletition}
						/>
					</div>

					<div>
						<Label htmlFor="kind">Classe</Label>
						<Input
							aria-required
							required
							id="kind"
							name="kind"
							type="text"
							placeholder="Mammalia"
							value={taxonomicClass}
							onChange={onChange(setTaxonomicClass)}
							disabled={isLoadingCompletition}
						/>
					</div>

					<div>
						<Label htmlFor="order">Ordem</Label>
						<Input
							aria-required
							required
							id="order"
							name="order"
							type="text"
							placeholder="Carnivora"
							value={taxonomicOrder}
							onChange={onChange(setTaxonomicOrder)}
							disabled={isLoadingCompletition}
						/>
					</div>

					<DialogFooter>
						<Button disabled={isLoading} type="submit">
							{isLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
							Salvar
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
