'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { Eye, LoaderCircle, MoreVertical } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { importRecordAction } from '@/lib/actions/import.action';
import { cn } from '@/lib/utils';
import { FetchImportRecordsResponse } from '@/lib/types/schemas/responses/fetch-imports';
import { formatToBR } from '@/lib/functions/dates';
import { FetchSpeciesResponse } from '@/lib/types/schemas/responses/fetch-species';
import { FetchEnclosuresResponse } from '@/lib/types/schemas/responses/fetch-enclosures';
import { handleServerErrors } from '@/lib/functions/errors';
import {
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
	Tooltip,
} from '@/components/ui/tooltip';
import {
	DropdownMenuTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';

const IMPORT_TYPE = 'animal';

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

	const { executeAsync, isExecuting } = useAction(importRecordAction, {
		onSuccess() {
			console.log('Success');
			setSelected([]);
		},
		onError({ error }) {
			console.error('Falha ao importar animal', error);
			if (!error.validationErrors) {
				toast.error('Falha ao importar animal, tente novamente.');
			}
		},
	});

	const isLoading = isExecuting;

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

	const onImport = useCallback(
		async (ids: string[]) => {
			const result = await executeAsync({
				type: IMPORT_TYPE,
				ids,
			});
			const { proceed } = handleServerErrors(result);
			if (!proceed) {
				return;
			}

			toast.success('Importação finalizada!');
		},
		[executeAsync],
	);

	const onImportAll = useCallback(
		() => onImport(selected),
		[selected, onImport],
	);

	if (animals.length === 0) {
		return null;
	}

	return (
		<div className="grid gap-4">
			<div className="relative flex justify-between">
				<h2 className="text-lg font-semibold py-4">
					({animals.length}) Animais
				</h2>

				{selected.length > 0 && (
					<Button className="sticky" disabled={isLoading} onClick={onImportAll}>
						{isLoading ? <LoaderCircle className="animate-spin" /> : null}(
						{selected.length}) Importar selecionados
					</Button>
				)}
			</div>

			<p className="text-muted-foreground">
				Abaixo estão os principais dados do animal, você pode visualizá-los
				clicando no botão de ações e em{' '}
				<span className="text-primary">&quot;Ver animal&quot;</span>
			</p>

			<form>
				<div className="grid grid-cols-[auto,repeat(4,1fr),40px,auto] items-center border p-2 gap-2 text-center">
					<span className="text-sm font-semibold text-center px-2">
						<Checkbox
							value={'all'}
							onCheckedChange={selectAll()}
							checked={selected.length > 0}
						/>
					</span>
					<span className="text-sm font-semibold">Marcação</span>
					<span className="text-sm font-semibold">Sexo</span>
					<span className="text-sm font-semibold">Nascimento</span>
					<span className="text-sm font-semibold">Situação</span>
					<span className="text-sm font-semibold">Ver</span>
					<span className="text-sm font-semibold">Ações</span>
				</div>

				{animals.map((a) => (
					<div
						className="grid grid-cols-[auto,repeat(4,1fr),40px,auto] items-center px-2 border-x gap-2 last:border-b even:bg-muted-foreground/10 hover:bg-muted-foreground/20 p-2"
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
						<span className="text-sm text-center">
							{a.washer_code || a.microchip_code}
						</span>
						<span className="text-sm text-center">{a.gender}</span>
						<span className="text-sm text-center">
							{a.age || formatToBR(a.born_date)}
						</span>

						<div
							className={cn(
								'block w-full text-nowrap overflow-x-hidden text-ellipsis text-center',
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

						<HoverCard openDelay={200}>
							<HoverCardTrigger asChild>
								<Button asChild variant={'outline'}>
									<Link
										href={`/dashboard/animais?type=import&animal_id=${a.id}`}
									>
										<Eye />
									</Link>
								</Button>
							</HoverCardTrigger>
							<HoverCardContent>
								<span className="text-sm font-semibold">Dados preenchidos</span>
								<Separator className="my-2" />
								<div className="flex items-center gap-2 mb-2">
									{a.species_id && (
										<span>{speciesMap.get(a.species_id || '')}</span>
									)}

									{a.species_id && a.enclosure_id && (
										<Separator className="h-4" orientation="vertical" />
									)}

									<span className="text-sm text-muted-foreground">
										{enclosuresMap.get(a.enclosure_id || '')}
									</span>
								</div>
								<div className="flex flex-col gap-2">
									<span className="text-sm">
										<strong>Data de chegada</strong>:<br />
										{formatToBR(a.landing_at)}
									</span>
									<span className="text-sm">
										<strong>Idade</strong>: {a.age || formatToBR(a.born_date)}
									</span>
									{a.origin && (
										<span className="text-sm">
											<strong>Origem</strong>: {a.origin}
										</span>
									)}

									{a.microchip_code && (
										<span className="text-sm">
											<strong>Microchip</strong>: {a.microchip_code}
										</span>
									)}

									{a.washer_code && (
										<span className="text-sm">
											<strong>Anilha</strong>: {a.washer_code}
										</span>
									)}

									{a.observation && (
										<span className="text-sm">
											<strong>Observações</strong>: {a.observation}
										</span>
									)}
								</div>
							</HoverCardContent>
						</HoverCard>

						<div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size="icon">
										<MoreVertical />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent>
									<DropdownMenuLabel>Ações</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Button variant="outline" className="w-full">
											Ver animal
										</Button>
									</DropdownMenuItem>
									{a.reason ? (
										<DropdownMenuItem>
											<Button variant="destructive" className="w-full">
												Corrigir
											</Button>
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem>
											<Button
												variant="outline"
												className="w-full"
												onClick={() => onImport([a.id])}
											>
												Importar
											</Button>
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				))}
			</form>
		</div>
	);
}
