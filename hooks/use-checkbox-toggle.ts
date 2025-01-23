import { useCallback, useState } from 'react';

export function useCheckboxToggle(cb?: (items: string[]) => void) {
	const [selectedItems, setSelectedItems] = useState<string[]>([]);

	const toggleItem = useCallback(
		(id: string) => (check: boolean | 'indeterminate') => {
			setSelectedItems((prevItems) => {
				const idx = prevItems.indexOf(id);
				const isChecked = typeof check === 'boolean' && check;

				if (isChecked && idx < 0) {
					const result = [...prevItems, id];
					cb?.(result);
					return result;
				}

				if (!isChecked && idx > -1) {
					prevItems.splice(idx, 1);
					const result = [...prevItems];
					cb?.(result);
					return result;
				}

				cb?.(prevItems);
				return prevItems;
			});
		},
		[cb],
	);

	return [selectedItems, toggleItem] as const;
}
