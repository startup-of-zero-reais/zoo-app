'use client';

import { useCallback, useState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { parseISO, startOfDay, subYears } from 'date-fns';
import { handleServerErrors } from '@/lib/functions/errors';
import { addAnimalAction } from '@/lib/actions/add-animal-action';
import { Species } from '@/lib/types/entities/species';
import { Enclosure } from '@/lib/types/entities/enclosure';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useOpenChange } from '@/hooks/use-open-change';
import SearchSpecies from './species-form';

interface AnimalsFormProps {
	enclosures: Enclosure[];
}

export default function AnimalsForm({ enclosures = [] }: AnimalsFormProps) {
	const [open, onOpenChange, onClose] = useOpenChange();

	const [markType, setMarkType] = useState<'microchip' | 'anilha'>('microchip');
	const [animalAge, setAnimalAge] = useState<number | null>(null);
	const [animalBorn, setAnimalBorn] = useState<Date | null>(null);
	const [specie, setSpecie] = useState({} as Species);
	const [selectedEnclosure, setSelectedEnclosure] = useState('');

	const { executeAsync, hasSucceeded, isExecuting } = useAction(
		addAnimalAction,
		{
			onSuccess() {
				console.log(`Animal criado!`);
			},
			onError({ error }) {
				console.error('Falha ao adicionar animal', error);
				if (!error.validationErrors) {
					toast.error('Falha ao adicionar animal, tente novamente.');
				}
			},
		},
	);

	const isLoading = hasSucceeded || isExecuting;

	const onSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			// @ts-expect-error unknown is not string
			const name: string = e.target['name'].value as unknown;
			// @ts-expect-error unknown is not string
			const mark_num: string = e.target['mark'].value as unknown;
			// @ts-expect-error unknown is not string
			const entry_date = parseISO(e.target['entry_date'].value as unknown);
			// @ts-expect-error unknown is not string
			const origin: string = e.target['origin'].value as unknown;

			const hasAge = typeof animalAge === 'number';
			let animal_born = hasAge
				? startOfDay(subYears(new Date(), animalAge))
				: animalBorn;

			if (!animal_born) {
				animal_born = startOfDay(new Date());
			}

			const species = specie.id;
			const enclosure = selectedEnclosure;

			// @ts-expect-error unknown is not number
			const weight: number = e.target['weight'].valueAsNumber as unknown;

			const result = await executeAsync({
				name,
				mark_type: markType,
				mark_num,
				entry_date,
				origin,
				animal_born,
				species,
				enclosure,
				weight,
			});
			const { proceed } = handleServerErrors(result);
			if (!proceed) {
				return;
			}

			toast.success('Adicionado!');
			onClose();
		},
		[
			executeAsync,
			onClose,
			markType,
			animalAge,
			animalBorn,
			specie.id,
			selectedEnclosure,
		],
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
								<ToggleGroup
									type="single"
									variant="outline"
									// @ts-expect-error enum is not a string
									onValueChange={setMarkType}
									value={markType}
								>
									<ToggleGroupItem value="microchip">Microchip</ToggleGroupItem>
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
									aria-required={!animalBorn}
									required={!animalBorn}
									id="age"
									name="age"
									type="number"
									placeholder="18"
									className="text-right"
									onChange={(e) => {
										setAnimalAge(e.target.valueAsNumber);
									}}
								/>
								<span className="uppercase text-muted-foreground text-sm">
									Ou
								</span>
								<Input
									aria-required={!animalAge}
									required={!animalAge}
									id="born"
									name="born"
									type="datetime-local"
									onChange={(e) => {
										setAnimalBorn(
											e.target.value ? parseISO(e.target.value) : null,
										);
									}}
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
								<Label htmlFor="enclosure">Recinto</Label>
								<Select onValueChange={(value) => setSelectedEnclosure(value)}>
									<SelectTrigger>
										<SelectValue
											id="enclosure"
											placeholder={
												<span
													className="data-[selected=false]:text-muted-foreground"
													data-selected={!!selectedEnclosure}
												>
													Savana
												</span>
											}
										/>
									</SelectTrigger>
									<SelectContent>
										{enclosures.map((enclosure) => (
											<SelectItem key={enclosure.id} value={enclosure.id}>
												{enclosure.identification}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="weight">Peso atual (kg)</Label>
								<Input
									aria-required
									required
									id="weight"
									name="weight"
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
