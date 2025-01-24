'use client';

import { useCallback, useState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { addAnimalWeightAction } from '@/lib/actions/add-animal-weight.action';
import { extractFormData } from '@/lib/functions/extract-form-data';
import { handleServerErrors } from '@/lib/functions/errors';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useOpenChange } from '@/hooks/use-open-change';

export default function WeightForm({ animal_id }: { animal_id: string }) {
	const [open, onOpenChange, onClose] = useOpenChange();

	const [scale, setScale] = useState('k');

	const { executeAsync, hasSucceeded, isExecuting } = useAction(
		addAnimalWeightAction,
		{
			onSuccess() {
				console.log('Peso adicionado!');
			},
			onError({ error }) {
				console.error('Falhou ao adicionar novo peso');
				if (!error.validationErrors) {
					toast.error('Falha para registrar novo peso. Tente novamente');
				}
			},
		},
	);

	const isLoading = hasSucceeded || isExecuting;

	const onSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			const { weight } = extractFormData(e, ['weight']);

			if (scale === 'k') {
				const result = await executeAsync({
					weight: parseFloat(weight),
					animal_id,
				});

				const { proceed } = handleServerErrors(result);
				if (!proceed) {
					return;
				}
			} else {
				const gramsIntoKg = parseFloat(weight) / 1000;
				const result = await executeAsync({ weight: gramsIntoKg, animal_id });

				const { proceed } = handleServerErrors(result);
				if (!proceed) {
					return;
				}
			}

			onClose();
		},
		[executeAsync, onClose, scale, animal_id],
	);

	return (
		<Dialog defaultOpen={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Novo peso</DialogTitle>
					<DialogDescription>
						Adicione um novo peso aqui. Clique para salvar quando estiver pronto
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-4">
						<div className="grid grid-cols-[1fr,auto] gap-4">
							<div>
								<Label htmlFor="weight">Peso</Label>
								<Input
									id="weight"
									name="weight"
									type="number"
									placeholder="300"
								/>
							</div>

							<div>
								<Label htmlFor="obs">Escala</Label>
								<ToggleGroup
									type="single"
									variant="outline"
									value={scale}
									onValueChange={setScale}
								>
									<ToggleGroupItem value="k">Kilos</ToggleGroupItem>
									<ToggleGroupItem value="g">Gramas</ToggleGroupItem>
								</ToggleGroup>
							</div>
						</div>
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
