'use client';

import { useCallback } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { addEnclosureAction } from '@/lib/actions/add-enclosure.action';
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

export default function EnclosureForm() {
	const [open, onOpenChange, onClose] = useOpenChange();

	const { executeAsync, hasSucceeded, isExecuting } = useAction(
		addEnclosureAction,
		{
			onSuccess() {
				console.log(`Recinto criado!`);
			},
			onError({ error }) {
				console.error('Falha ao adicionar recinto', error);
				if (!error.validationErrors) {
					toast.error('Falha ao adicionar recinto, tente novamente.');
				}
			},
		},
	);

	const isLoading = hasSucceeded || isExecuting;

	const onSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			// @ts-expect-error unknown is not string
			const identifier: string = e.target['identifier'].value as unknown;

			const result = await executeAsync({ identifier });
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
					<DialogTitle>Novo recinto</DialogTitle>
					<DialogDescription>
						Adicione um novo recinto aqui. Clique para salvar quando estiver
						pronto
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<Label htmlFor="identifier">Identificação do recinto</Label>
						<Input
							aria-required
							required
							id="identifier"
							name="identifier"
							type="text"
							placeholder="Savana"
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
