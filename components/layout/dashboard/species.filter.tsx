import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Species } from '@/lib/types/schemas/species.schema';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCheckboxToggle } from '@/hooks/use-checkbox-toggle';

interface SpeciesFilterProps {
	species: Species[];
	onSelect: (selected: string[]) => void;
}

export function SpeciesFilter({ species, onSelect }: SpeciesFilterProps) {
	const searchParams = useSearchParams();
	const speciesParams = (searchParams.get('species') || '').split(',');

	const [selectedItems, toggleSpecie] = useCheckboxToggle(onSelect);

	const isChecked = useCallback(
		(id: string) => {
			return selectedItems.indexOf(id) > -1 || speciesParams.indexOf(id) > -1;
		},
		[selectedItems, speciesParams],
	);

	return (
		<div>
			<span className="text-sm font-semibold">Espécies</span>

			<ScrollArea className="border p-4 h-72">
				<div className="grid gap-2">
					{species.map((specie) => (
						<div key={specie.id} className="flex items-center gap-2">
							<Checkbox
								id={specie.id}
								onCheckedChange={toggleSpecie(specie.id)}
								checked={isChecked(specie.id)}
							/>
							<Label
								htmlFor={specie.id}
								className="select-none flex gap-2 items-center"
							>
								<span>{specie.common_name}</span>
								<Separator
									orientation="vertical"
									className="h-3 hidden xl:block"
								/>
								<span className="font-semibold text-muted-foreground hidden xl:block">
									{specie.scientific_name}
								</span>
								<Separator orientation="vertical" className="h-3" />
								<span className="font-normal text-muted-foreground">
									{specie.taxonomic_order}
								</span>
							</Label>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
