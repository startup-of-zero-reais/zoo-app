import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Enclosure } from '@/lib/types/schemas/enclosure.schema';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCheckboxToggle } from '@/hooks/use-checkbox-toggle';

interface EnclosuresFilterProps {
	enclosures: Enclosure[];
	onSelect: (id: string[]) => void;
}

export function EnclosuresFilter({
	enclosures,
	onSelect,
}: EnclosuresFilterProps) {
	const searchParams = useSearchParams();
	const enclosureParams = (searchParams.get('enclosures') || '').split(',');

	const [selectedItems, toggleEnclosure] = useCheckboxToggle(onSelect);

	const isChecked = useCallback(
		(id: string) => {
			return selectedItems.indexOf(id) > -1 || enclosureParams.indexOf(id) > -1;
		},
		[selectedItems, enclosureParams],
	);

	return (
		<div>
			<span className="text-sm font-semibold">Recintos</span>

			<ScrollArea className="border p-4 h-72">
				<div className="grid gap-2">
					{enclosures.map((enclosure) => (
						<div key={enclosure.id} className="flex items-center gap-2">
							<Checkbox
								id={enclosure.id}
								onCheckedChange={toggleEnclosure(enclosure.id)}
								checked={isChecked(enclosure.id)}
							/>
							<Label htmlFor={enclosure.id} className="select-none">
								{enclosure.identification}
							</Label>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
