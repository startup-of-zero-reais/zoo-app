'use client';

import { useCallback, useState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { parseISO } from 'date-fns';
import { handleServerErrors } from '@/lib/functions/errors';
import { addAnimalAction } from '@/lib/actions/add-animal-action';
import { Species } from '@/lib/types/schemas/species.schema';
import { Enclosure } from '@/lib/types/entities/enclosure';
import { extractFormData } from '@/lib/functions/extract-form-data';
import { AgeTypes, GenderTypes } from '@/lib/types/entities/animal';
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

	const [animalAge, setAnimalAge] = useState<AgeTypes | null>(null);
	const [animalBorn, setAnimalBorn] = useState<Date | null>(null);
	const [animalGender, setAnimalGender] = useState<GenderTypes>('undefined');
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
			const { name, washer_code, chip, entry_date, origin, obs, weight } =
				extractFormData(e, [
					'name',
					'washer_code',
					'chip',
					'entry_date',
					'origin',
					'obs',
					'weight',
				]);

			const born_date = animalBorn || undefined;
			const species = specie.id;
			const enclosure = selectedEnclosure;

			const result = await executeAsync({
				name,
				microchip_code: chip,
				washer_code,
				entry_date: parseISO(entry_date),
				origin,
				born_date,
				age: animalAge || undefined,
				observation: obs,
				gender: animalGender,
				species,
				enclosure,
				weight: parseFloat(weight),
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
			animalAge,
			animalBorn,
			animalGender,
			specie.id,
			selectedEnclosure,
		],
	);

	return (
		<Dialog defaultOpen={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-svh overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Novo animal</DialogTitle>
					<DialogDescription>
						Adicione um novo animal aqui. Clique para salvar quando estiver
						pronto
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="name">Nome</Label>
								<Input id="name" name="name" type="text" placeholder="Simba" />
							</div>

							<div>
								<Label htmlFor="obs">Observação/Característica</Label>
								<Input
									id="obs"
									name="obs"
									type="text"
									placeholder="Macho claro"
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="chip">Marcação</Label>
							<div className="grid grid-cols-2 gap-x-4 items-center">
								<Input
									id="chip"
									name="chip"
									type="text"
									placeholder="ex: 900233000341870"
									className="flex-1"
								/>

								<Input
									id="washer"
									name="washer"
									type="text"
									placeholder="ex: IBAMA ES 13,5 704"
									className="flex-1"
								/>

								<label htmlFor="chip" className="text-xs text-muted-foreground">
									Microchip
								</label>
								<label
									htmlFor="washer"
									className="text-xs text-muted-foreground"
								>
									Anilha
								</label>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
									id="origin"
									name="origin"
									type="text"
									placeholder="Centro de triagem"
								/>
							</div>
						</div>

						<div className="grid items-center gap-2">
							<Label>Idade do animal</Label>
							<ToggleGroup
								type="single"
								variant="outline"
								// @ts-expect-error setAnimalAge expects an enum not a primitive string
								onValueChange={setAnimalAge}
								value={animalAge || undefined}
							>
								<ToggleGroupItem value="neonate">Neonato</ToggleGroupItem>
								<ToggleGroupItem value="cub">Filhote</ToggleGroupItem>
								<ToggleGroupItem value="young">Jovem</ToggleGroupItem>
								<ToggleGroupItem value="adult">Adulto</ToggleGroupItem>
								<ToggleGroupItem value="senile">Senil</ToggleGroupItem>
							</ToggleGroup>

							<span className="uppercase text-muted-foreground text-sm text-center">
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
							<label htmlFor="born" className="text-xs text-muted-foreground">
								Data de nascimento
							</label>
						</div>

						<div>
							<Label>Gênero</Label>
							<ToggleGroup
								type="single"
								variant="outline"
								defaultValue="undefined"
								// @ts-expect-error setAnimalGender expects an enum not a primitive string
								onValueChange={setAnimalGender}
								value={animalGender}
							>
								<ToggleGroupItem value="female">Feminino</ToggleGroupItem>
								<ToggleGroupItem value="male">Masculino</ToggleGroupItem>
								<ToggleGroupItem value="undefined">Indefinido</ToggleGroupItem>
							</ToggleGroup>
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
