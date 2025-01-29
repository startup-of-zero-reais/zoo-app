'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { FetchImportRecordsResponse } from '@/lib/types/schemas/responses/fetch-imports';
import { formatToBR } from '@/lib/functions/dates';
import { FetchSpeciesResponse } from '@/lib/types/schemas/responses/fetch-species';
import { FetchEnclosuresResponse } from '@/lib/types/schemas/responses/fetch-enclosures';
import {
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
	Tooltip,
} from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface AnimalsListProps {
	species: FetchSpeciesResponse;
	enclosures: FetchEnclosuresResponse;
	animals: FetchImportRecordsResponse['animals'];
}

export default function AnimalsList({
	animals,
	species,
	enclosures,
}: AnimalsListProps) {
	const [selected, setSelected] = useState<string[]>([]);

	const speciesMap = new Map(species.species.map((s) => [s.id, s.common_name]));
	const enclosuresMap = new Map(
		enclosures.enclosures.map((e) => [e.id, e.identification]),
	);

	const selectAll = useCallback(
		() => (checked: boolean) => {
			if (checked) {
				setSelected(
					animals.flatMap((animal) => (animal.reason ? [] : [animal.id])),
				);
			} else {
				setSelected([]);
			}
		},
		[animals],
	);

	const onSelect = useCallback(
		(id: string) => (checked: boolean | 'indeterminate') => {
			setSelected((prev) => {
				const idx = prev.indexOf(id);
				const alreadyIn = idx > -1;
				const isChecked =
					(typeof checked === 'boolean' && checked === true) ||
					(typeof checked === 'string' && checked !== 'indeterminate');

				if (alreadyIn && !isChecked) {
					prev.splice(prev.indexOf(id), 1);
					return [...prev];
				} else if (!alreadyIn && isChecked) {
					return [...prev, id];
				}

				return prev;
			});
		},
		[],
	);

	if (animals.length === 0) {
		return null;
	}

	return (
		<div className="grid">
			<div className="relative flex justify-between">
				<h2 className="text-lg font-semibold py-4">
					({animals.length}) Animais
				</h2>

				{selected.length > 0 && (
					<Button className="sticky">
						({selected.length}) Importar selecionados
					</Button>
				)}
			</div>

			<form>
				<div className="grid grid-cols-[auto,repeat(8,1fr)] items-center border p-2">
					<span className="text-sm font-semibold text-center px-2">
						<Checkbox value={'all'} onCheckedChange={selectAll()} />
					</span>
					<span className="text-sm font-semibold">Data de chegada</span>
					<span className="text-sm font-semibold">Origem</span>
					<span className="text-sm font-semibold">Sexo</span>
					<span className="text-sm font-semibold">Nascimento</span>
					<span className="text-sm font-semibold">Marcação</span>
					<span className="text-sm font-semibold">Espécie</span>
					<span className="text-sm font-semibold">Recinto</span>
					<span className="text-sm font-semibold">Situação</span>
				</div>

				{animals.map((a) => (
					<div
						className="grid grid-cols-[auto,repeat(8,1fr)] items-center px-2 border-x last:border-b even:bg-muted-foreground/10 hover:bg-muted-foreground/20 p-2"
						key={a.id}
					>
						<div className="px-2">
							{a.reason ? (
								<TooltipProvider delayDuration={100}>
									<Tooltip>
										<TooltipTrigger>
											<Checkbox
												value={a.id}
												onCheckedChange={onSelect(a.id)}
												checked={selected.indexOf(a.id) > -1}
												disabled={!!a.reason}
												className="border-muted-foreground/40 bg-muted-foreground/5"
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p>
												Não é possível selecionar importações que contém erros
											</p>
											<p>Corrija os erros para conseguir importar</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : (
								<Checkbox
									value={a.id}
									onCheckedChange={onSelect(a.id)}
									checked={selected.indexOf(a.id) > -1}
								/>
							)}
						</div>
						<span className="text-sm">{formatToBR(a.landing_at)}</span>
						<span className="text-sm">{a.origin}</span>
						<span className="text-sm">{a.gender}</span>
						<span className="text-sm">{a.age || formatToBR(a.born_date)}</span>
						<span className="text-sm">{a.washer_code || a.microchip_code}</span>
						<span className="text-sm">
							{speciesMap.get(a.species_id || '')}
						</span>
						<span className="text-sm">
							{enclosuresMap.get(a.enclosure_id || '')}
						</span>
						<div
							className={cn(
								'block w-full text-nowrap overflow-x-hidden text-ellipsis ',
								a.reason ? 'text-destructive' : 'text-green-600',
							)}
						>
							<TooltipProvider delayDuration={100}>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="text-sm">{a.reason || 'Válido'}</span>
									</TooltipTrigger>
									{a.reason && <TooltipContent>{a.reason}</TooltipContent>}
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				))}
			</form>
		</div>
	);
}
