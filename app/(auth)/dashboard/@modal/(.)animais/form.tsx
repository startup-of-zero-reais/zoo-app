'use client';

import { useCallback, useState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { addEnclosureAction } from '@/lib/actions/add-enclosure.action';
import { handleServerErrors } from '@/lib/functions/errors';
import { Species } from '@/lib/types/entities/species';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
import SearchSpecies from './species-form';

export default function AnimalsForm() {
	const [open, onOpenChange, onClose] = useOpenChange();
	const [specie, setSpecie] = useState({} as Species);

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
					<DialogTitle>Novo animal</DialogTitle>
					<DialogDescription>
						Adicione um novo animal aqui. Clique para salvar quando estiver
						pronto
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-4">
						<div>
							<Label htmlFor="name">Nome</Label>
							<Input
								aria-required
								required
								id="name"
								name="name"
								type="text"
								placeholder="Simba"
							/>
						</div>

						<div>
							<Label htmlFor="mark">Marcação</Label>
							<div className="flex gap-4 items-center">
								<ToggleGroup type="single" variant="outline">
									<ToggleGroupItem defaultChecked value="microchip">
										Microchip
									</ToggleGroupItem>
									<ToggleGroupItem value="anilha">Anilha</ToggleGroupItem>
								</ToggleGroup>

								<Input
									aria-required
									required
									id="mark"
									name="mark"
									type="text"
									placeholder="ex: 123456"
									className="flex-1"
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="entry_date">Data de chegada</Label>
							<Input
								aria-required
								required
								id="entry_date"
								name="entry_date"
								type="datetime-local"
							/>
						</div>

						<div>
							<Label htmlFor="origin">Origem</Label>
							<Input
								aria-required
								required
								id="origin"
								name="origin"
								type="text"
								placeholder="Centro de triagem"
							/>
						</div>

						<div>
							<Label htmlFor="age">Idade do animal</Label>
							<div className="grid grid-cols-[1fr,auto,2fr] items-center gap-x-2 gap-y-1">
								<Input
									aria-required
									required
									id="identifier"
									name="identifier"
									type="number"
									placeholder="18"
									className="text-right"
								/>
								<span className="uppercase text-muted-foreground text-sm">
									Ou
								</span>
								<Input
									aria-required
									required
									id="identifier"
									name="identifier"
									type="datetime-local"
									placeholder="Savana"
								/>

								<span className="text-xs text-muted-foreground">Idade</span>
								<div></div>
								<span className="text-xs text-muted-foreground">
									Data de nascimento
								</span>
							</div>
						</div>

						<div>
							<SearchSpecies
								placeholder="Selecione uma espécie"
								selectedItem={specie}
								onSelect={setSpecie}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-[2fr,1fr] md:grid-cols-[3fr,1fr] gap-2">
							<div>
								<Label htmlFor="identifier">Recinto</Label>
								<Input
									aria-required
									required
									id="identifier"
									name="identifier"
									type="text"
									placeholder="Savana"
								/>
							</div>

							<div>
								<Label htmlFor="identifier">Peso atual (kg)</Label>
								<Input
									aria-required
									required
									id="identifier"
									name="identifier"
									type="number"
									placeholder="135"
									className="text-right"
								/>
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
