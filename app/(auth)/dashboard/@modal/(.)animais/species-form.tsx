'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Species } from '@/lib/types/entities/species';
import { useSpecies } from '@/lib/swr/use-species';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchSpeciesProps {
	placeholder?: string;
	selectedItem?: Species;
	onSelect?: (specie: Species) => void;
}

export default function SearchSpecies({
	placeholder = 'Selecione um valor',
	selectedItem,
	onSelect: onSelectValue,
}: SearchSpeciesProps) {
	const [open, onOpenChange] = useState(false);
	const [selected, setSelected] = useState(selectedItem || ({} as Species));
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 400);

	const { species, isLoading, isError } = useSpecies(debouncedSearch);

	const hasOption = !!selected.common_name && !!selected.cientific_name;

	const onSelect = useCallback(
		(specie: Species) => () => {
			setSelected(specie);
			onSelectValue?.(specie);
			onOpenChange(false);
		},
		[onSelectValue],
	);

	return (
		<div>
			<Label htmlFor="species-btn">Espécie</Label>
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetTrigger asChild>
					<Button
						id="species-btn"
						variant="outline"
						className={cn(
							'w-full justify-start font-normal',
							hasOption
								? ''
								: 'text-muted-foreground hover:text-muted-foreground',
						)}
					>
						{hasOption ? (
							<>
								{selected.common_name} | {selected.cientific_name}
							</>
						) : (
							<>{placeholder}</>
						)}
					</Button>
				</SheetTrigger>

				<SheetContent className="grid grid-rows-[auto,auto,1fr,auto]">
					<SheetHeader>
						<SheetTitle>Selecione a espécie</SheetTitle>
						<SheetDescription>
							Pesquise abaixo e selecione a espécie. A pesquisa pode ser por{' '}
							<span className="text-primary">nome científico</span> ou por{' '}
							<span className="text-primary">nome popular</span>
						</SheetDescription>
					</SheetHeader>

					<div className="grid grid-cols-[1fr,40px] gap-2">
						<Input
							placeholder="Panthera leo"
							onChange={(e) => setSearch(e.target.value)}
							value={search}
						/>

						<Tooltip>
							<TooltipTrigger className="border flex items-center justify-center flex-1">
								<div>
									<X
										size={18}
										className="text-muted-foreground"
										onClick={() => setSearch('')}
									/>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<span>Limpar pesquisa e resultados</span>
							</TooltipContent>
						</Tooltip>
					</div>

					<ScrollArea className="border p-2">
						<div className="w-full flex flex-col gap-2">
							{isError && (
								<p className="border border-destructive bg-destructive/10 text-destructive text-sm p-4">
									Ocorreu um erro, tente novamente. Se o erro persistir, contate
									nossa equipe de suporte
								</p>
							)}

							{isLoading && (
								<>
									{Array(20)
										.fill(null)
										.map((_, i) => (
											<div
												key={i.toString()}
												className="border p-2 w-full grid grid-cols-[1fr,auto,1fr] gap-1 items-center"
											>
												<Skeleton className="h-full" />
												<Separator
													orientation="vertical"
													className="h-4 mx-2"
												/>
												<Skeleton className="h-full" />
											</div>
										))}
								</>
							)}

							{species.species.length === 0 && (
								<div className="border p-2 w-full flex flex-col items-center gap-2">
									<h1 className="text-xl font-semibold">Nenhum resultado</h1>
									<h2 className="text-2xl">
										😥
										<span hidden>Emoji desapontado</span>
									</h2>
									<p className="text-sm text-muted-foreground text-center">
										Tente buscar com outro termo, ou tente cadastrar uma nova
										espécie
									</p>
									<Button asChild>
										<Link href={'/dashboard/especies'}>
											<PlusCircle />
											Adicionar espécie ao sistema
										</Link>
									</Button>
								</div>
							)}

							{species.species.map((species) => (
								<button
									key={species.id}
									className="border p-2 hover:bg-muted-foreground/10 data-[selected=true]:bg-primary/20"
									onClick={onSelect(species)}
									data-selected={selected.id === species.id}
								>
									<header className="grid grid-cols-[1fr,auto,1fr] gap-1 items-center">
										<span className="text-sm">{species.common_name}</span>
										<Separator orientation="vertical" className="h-4 mx-2" />
										<span className="text-sm text-muted-foreground">
											{species.cientific_name}
										</span>
									</header>
								</button>
							))}
						</div>
					</ScrollArea>

					<SheetFooter>
						<span className="text-sm text-muted-foreground">
							Clique ou toque fora da caixa para fechar esta aba
						</span>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
