import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCheckboxToggle } from '@/hooks/use-checkbox-toggle';

interface SimpleCheckboxGroupProps {
	label: string;
	items: Array<{ id: string; label: string }>;
	onSelect: (items: string[]) => void;
	className?: string;
	searchParamKey?: string;
}

export function SimpleCheckboxGroup({
	label,
	items,
	onSelect,
	className,
	searchParamKey,
}: SimpleCheckboxGroupProps) {
	const searchParams = useSearchParams();
	const itemsParams = (searchParams.get(searchParamKey || '') || '').split(',');

	const [selectedItems, toggleItem] = useCheckboxToggle(onSelect);

	const isChecked = useCallback(
		(id: string) => {
			return selectedItems.indexOf(id) > -1 || itemsParams.indexOf(id) > -1;
		},
		[selectedItems, itemsParams],
	);

	return (
		<div>
			<span className="text-sm font-semibold">{label}</span>

			<ScrollArea className={cn('border p-4 h-28', className)}>
				<div className="grid gap-2">
					{items.map((item) => (
						<div key={item.id} className="flex items-center gap-2">
							<Checkbox
								id={item.id}
								onCheckedChange={toggleItem(item.id)}
								checked={isChecked(item.id)}
							/>
							<Label htmlFor={item.id} className="select-none ">
								<span>{item.label}</span>
							</Label>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
