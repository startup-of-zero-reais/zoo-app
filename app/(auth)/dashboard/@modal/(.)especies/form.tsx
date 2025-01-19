'use client';

import { useCallback } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { addSpeciesAction } from '@/lib/actions/add-species.action';
import { handleServerErrors } from '@/lib/functions/errors';
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
import { useOpenChange } from '@/hooks/use-open-change';

export default function SpeciesForm() {
	const [open, onOpenChange, onClose] = useOpenChange();

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

	const isLoading = hasSucceeded || isExecuting;

	const onSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			// @ts-expect-error unknown is not string
			const common_name: string = e.target['common_name'].value as unknown;
			// @ts-expect-error unknown is not string
			const cientific_name: string = e.target['cientific'].value as unknown;

			const result = await executeAsync({ common_name, cientific_name });
			const { proceed } = handleServerErrors(result);
			if (!proceed) {
				return;
			}

			toast.success('Adicionado!');
			onClose();
		},
		[executeAsync, onClose],
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
					<div>
						<Label htmlFor="common_name">Nome popular</Label>
						<Input
							aria-required
							required
							id="common_name"
							name="common_name"
							type="text"
							placeholder="Leão"
						/>
					</div>

					<div>
						<Label htmlFor="cientific">Nome científico</Label>
						<Input
							aria-required
							required
							id="cientific"
							name="cientific"
							type="text"
							placeholder="Panthera leo"
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
