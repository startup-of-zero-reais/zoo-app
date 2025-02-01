'use client';

import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FetchImportRecordsResponse } from '@/lib/types/schemas/responses/fetch-imports';
import { handleServerErrors } from '@/lib/functions/errors';
import { importRecordAction } from '@/lib/actions/import.action';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const IMPORT_TYPE = 'enclosure';

interface EnclosuresListProps {
	enclosures: FetchImportRecordsResponse['enclosures'];
}

export default function EnclosuresList({
	enclosures = [],
}: EnclosuresListProps) {
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
					enclosures.flatMap((enclosure) =>
						enclosure.reason ? [] : [enclosure.id],
					),
				);
			} else {
				setSelected([]);
			}
		},
		[enclosures, setSelected],
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

	if (enclosures.length === 0) {
		return null;
	}

	return (
		<div className="grid">
			<div className="relative flex justify-between">
				<h2 className="text-lg font-semibold py-4">
					({enclosures.length}) Recintos
				</h2>

				{selected.length > 0 && (
					<Button className="sticky" disabled={isLoading} onClick={onImportAll}>
						{isLoading ? <LoaderCircle className="animate-spin" /> : null}(
						{selected.length}) Importar selecionados
					</Button>
				)}
			</div>

			<div className="grid grid-cols-[40px,repeat(3,1fr)] items-center border p-2 gap-2">
				<span className="text-sm font-semibold">
					<Checkbox
						value="all"
						onCheckedChange={selectAll()}
						checked={selected.length > 0}
					/>
				</span>
				<span className="text-sm font-semibold">Identificação</span>
				<span className="text-sm font-semibold">Situação</span>
				<span className="text-sm font-semibold">Ações</span>
			</div>

			{enclosures.map((enclosure) => (
				<div
					className="grid grid-cols-[40px,repeat(3,1fr)] items-center border-x last:border-b even:bg-muted-foreground/10 hover:bg-muted-foreground/20 p-2 gap-2"
					key={enclosure.id}
				>
					<div className="px-2">
						{enclosure.reason ? (
							<TooltipProvider delayDuration={100}>
								<Tooltip>
									<TooltipTrigger>
										<Checkbox
											value={enclosure.id}
											onCheckedChange={onSelect(enclosure.id)}
											checked={selected.indexOf(enclosure.id) > -1}
											disabled={!!enclosure.reason}
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
								value={enclosure.id}
								onCheckedChange={onSelect(enclosure.id)}
								checked={selected.indexOf(enclosure.id) > -1}
							/>
						)}
					</div>

					<span className="text-sm">{enclosure.identification}</span>
					<div
						className={cn(
							'block w-full text-nowrap overflow-x-hidden text-ellipsis',
							enclosure.reason ? 'text-destructive' : 'text-green-600',
						)}
					>
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger asChild>
									{enclosure.reason ? (
										<span className="text-sm">{enclosure.reason}</span>
									) : (
										<Badge variant="success">
											{enclosure.reason || 'Válido'}
										</Badge>
									)}
								</TooltipTrigger>
								{enclosure.reason && (
									<TooltipContent>{enclosure.reason}</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>
					</div>
					<div>
						{enclosure.reason ? (
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
