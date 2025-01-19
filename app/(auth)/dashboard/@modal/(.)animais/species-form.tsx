'use client';

import { useCallback, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Species } from '@/lib/types/entities/species';
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
import { Separator } from '@/components/ui/separator';

const speciesApiResult = {
	total: 38,
	species: [
		{
			id: '02786098-12ef-46d0-a595-f51da3bbd601',
			cientific_name: 'Panthera leo',
			common_name: 'Leão',
			created_at: '2024-10-16T03:03:07.176440Z',
			updated_at: '2024-10-28T03:03:07.176440Z',
			deleted_at: null,
		},
		{
			id: 'e2928816-0a7a-4c4f-a063-a624a91d5f73',
			cientific_name: 'Canis lupus',
			common_name: 'Lobo',
			created_at: '2024-06-13T03:03:07.176603Z',
			updated_at: '2024-07-12T03:03:07.176603Z',
			deleted_at: null,
		},
		{
			id: 'dabac5c0-f580-4d00-98fc-86aef196bce5',
			cientific_name: 'Ursus arctos',
			common_name: 'Urso-pardo',
			created_at: '2024-07-18T03:03:07.176680Z',
			updated_at: '2024-08-11T03:03:07.176680Z',
			deleted_at: null,
		},
		{
			id: '09d3339e-7fbc-4e64-a8a6-21508599ea4d',
			cientific_name: 'Gorilla gorilla',
			common_name: 'Gorila',
			created_at: '2024-07-14T03:03:07.176724Z',
			updated_at: '2024-07-21T03:03:07.176724Z',
			deleted_at: null,
		},
		{
			id: '971c695f-8872-4eb4-9389-c372582dce9a',
			cientific_name: 'Elephas maximus',
			common_name: 'Elefante-asiático',
			created_at: '2024-01-31T03:03:07.176753Z',
			updated_at: '2024-02-25T03:03:07.176753Z',
			deleted_at: null,
		},
		{
			id: 'deb2e679-e50b-496d-8070-3c459aacd1a9',
			cientific_name: 'Ailuropoda melanoleuca',
			common_name: 'Panda-gigante',
			created_at: '2024-11-08T03:03:07.176823Z',
			updated_at: '2024-12-03T03:03:07.176823Z',
			deleted_at: null,
		},
		{
			id: 'f2ac9108-d1b6-443a-a1b5-16988d79e62b',
			cientific_name: 'Delphinus delphis',
			common_name: 'Golfinho-comum',
			created_at: '2024-05-23T03:03:07.176952Z',
			updated_at: '2024-06-22T03:03:07.176952Z',
			deleted_at: null,
		},
		{
			id: '6a139094-e34a-4b27-9fd1-66222b31b5f5',
			cientific_name: 'Falco peregrinus',
			common_name: 'Falcão-peregrino',
			created_at: '2025-01-08T03:03:07.177022Z',
			updated_at: '2025-01-31T03:03:07.177022Z',
			deleted_at: null,
		},
		{
			id: 'e9bbf634-b5fd-4ea0-a082-d6cd6a183145',
			cientific_name: 'Carcharodon carcharias',
			common_name: 'Tubarão-branco',
			created_at: '2024-04-13T03:03:07.177199Z',
			updated_at: '2024-04-23T03:03:07.177199Z',
			deleted_at: null,
		},
		{
			id: '182d14e7-32b4-4a01-80a0-78b01159e8b0',
			cientific_name: 'Chelonia mydas',
			common_name: 'Tartaruga-verde',
			created_at: '2024-12-02T03:03:07.177286Z',
			updated_at: '2024-12-29T03:03:07.177286Z',
			deleted_at: null,
		},
		{
			id: '33110207-5c0f-4d10-b26f-720ed1e11084',
			cientific_name: 'Pongo pygmaeus',
			common_name: 'Orangotango',
			created_at: '2024-12-30T03:03:07.177320Z',
			updated_at: '2025-01-21T03:03:07.177320Z',
			deleted_at: null,
		},
		{
			id: 'b24e00a6-f137-403e-9e27-cc56a58b5e52',
			cientific_name: 'Haliaeetus leucocephalus',
			common_name: 'Águia-careca',
			created_at: '2024-12-25T03:03:07.177369Z',
			updated_at: '2024-12-27T03:03:07.177369Z',
			deleted_at: null,
		},
		{
			id: '11c7cbc5-0480-4e27-b646-8b063c4c5742',
			cientific_name: 'Strix aluco',
			common_name: 'Coruja-das-torres',
			created_at: '2024-04-17T03:03:07.177394Z',
			updated_at: '2024-05-16T03:03:07.177394Z',
			deleted_at: null,
		},
		{
			id: '52998e59-fdca-41db-9828-99cb0072ec1b',
			cientific_name: 'Equus ferus caballus',
			common_name: 'Cavalo',
			created_at: '2024-10-03T03:03:07.177406Z',
			updated_at: '2024-10-05T03:03:07.177406Z',
			deleted_at: null,
		},
		{
			id: '9c891d3f-2696-48fd-a9a8-9dde0b9b62e4',
			cientific_name: 'Phascolarctos cinereus',
			common_name: 'Coala',
			created_at: '2024-06-18T03:03:07.177418Z',
			updated_at: '2024-07-17T03:03:07.177418Z',
			deleted_at: null,
		},
		{
			id: '01343b65-2325-4af2-bdc6-70e5cae12d23',
			cientific_name: 'Spheniscus demersus',
			common_name: 'Pinguim-africano',
			created_at: '2024-03-24T03:03:07.177433Z',
			updated_at: '2024-04-21T03:03:07.177433Z',
			deleted_at: null,
		},
		{
			id: '696b984b-bf6d-45a2-a092-8267d4a66235',
			cientific_name: 'Loxodonta africana',
			common_name: 'Elefante-africano',
			created_at: '2024-04-09T03:03:07.177446Z',
			updated_at: '2024-04-29T03:03:07.177446Z',
			deleted_at: null,
		},
		{
			id: 'afd096df-4bb8-4579-bc2e-3a468eda1233',
			cientific_name: 'Balaenoptera musculus',
			common_name: 'Baleia-azul',
			created_at: '2024-03-12T03:03:07.177458Z',
			updated_at: '2024-03-19T03:03:07.177458Z',
			deleted_at: null,
		},
		{
			id: 'e29b6214-3588-44eb-a12d-f2ec36449772',
			cientific_name: 'Vulpes vulpes',
			common_name: 'Raposa-vermelha',
			created_at: '2024-06-24T03:03:07.177482Z',
			updated_at: '2024-07-12T03:03:07.177482Z',
			deleted_at: null,
		},
	],
} satisfies {
	total: number;
	species: Species[];
};

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
						<Input placeholder="Panthera leo" />
						<div className="border flex items-center justify-center flex-1">
							<Search size={18} className="text-muted-foreground" />
						</div>
					</div>

					<ScrollArea className="border p-2">
						<div className="w-full flex flex-col gap-2">
							{speciesApiResult.species.map((species) => (
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
