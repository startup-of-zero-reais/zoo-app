'use client';

import { toast } from 'sonner';
import { useState, useCallback } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { importRecordAction } from '@/lib/actions/import.action';
import { handleServerErrors } from '@/lib/functions/errors';
import { FetchImportRecordsResponse } from '@/lib/types/schemas/responses/fetch-imports';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

const IMPORT_TYPE = 'species';

interface SpeciesListProps {
	species: FetchImportRecordsResponse['species'];
}

export default function SpeciesList({ species = [] }: SpeciesListProps) {
	const [selected, setSelected] = useState<string[]>([]);

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
					species.flatMap((specie) => (specie.reason ? [] : [specie.id])),
				);
			} else {
				setSelected([]);
			}
		},
		[species, setSelected],
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
		[setSelected],
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

	if (!species.length) {
		return null;
	}

	return (
		<div className="grid">
			<div className="relative flex justify-between">
				<h2 className="text-lg font-semibold py-4">
					({species.length}) Espécies
				</h2>

				{selected.length > 0 && (
					<Button className="sticky" disabled={isLoading} onClick={onImportAll}>
						{isLoading ? <LoaderCircle className="animate-spin" /> : null}(
						{selected.length}) Importar selecionados
					</Button>
				)}
			</div>

			<div className="grid grid-cols-[40px,repeat(6,1fr)] items-center border p-2 gap-2">
				<span className="text-sm font-semibold px-2">
					<Checkbox
						value="all"
						onCheckedChange={selectAll()}
						checked={selected.length > 0}
					/>
				</span>
				<span className="text-sm font-semibold">Nome comum</span>
				<span className="text-sm font-semibold">Nome científico</span>
				<span className="text-sm font-semibold">Ordem taxonômica</span>
				<span className="text-sm font-semibold">Classe taxonômica</span>
				<span className="text-sm font-semibold">Situação</span>
				<span className="text-sm font-semibold">Ações</span>
			</div>

			{species.map((s) => (
				<div
					className="grid grid-cols-[40px,repeat(6,1fr)] items-center border-x last:border-b even:bg-muted-foreground/10 hover:bg-muted-foreground/20 p-2 gap-2"
					key={s.id}
				>
					<div className="px-2">
						{s.reason ? (
							<TooltipProvider delayDuration={100}>
								<Tooltip>
									<TooltipTrigger>
										<Checkbox
											value={s.id}
											onCheckedChange={onSelect(s.id)}
											checked={selected.indexOf(s.id) > -1}
											disabled={!!s.reason}
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
								value={s.id}
								onCheckedChange={onSelect(s.id)}
								checked={selected.indexOf(s.id) > -1}
							/>
						)}
					</div>
					<span className="text-sm">{s.common_name}</span>
					<span className="text-sm">{s.scientific_name}</span>
					<span className="text-sm">{s.taxonomic_order}</span>
					<span className="text-sm">{s.kind}</span>
					<div
						className={cn(
							'block w-full text-nowrap overflow-x-hidden text-ellipsis',
							s.reason ? 'text-destructive' : 'text-green-600',
						)}
					>
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger asChild>
									{s.reason ? (
										<span className="text-sm">{s.reason}</span>
									) : (
										<Badge variant="success">Válido</Badge>
									)}
								</TooltipTrigger>
								{s.reason && <TooltipContent>{s.reason}</TooltipContent>}
							</Tooltip>
						</TooltipProvider>
					</div>
					<div>
						{s.reason ? (
							<Badge variant="secondary">Sem ações</Badge>
						) : (
							<Button variant="outline" size="sm">
								Importar
							</Button>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
