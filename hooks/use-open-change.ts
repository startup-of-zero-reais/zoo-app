import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export function useOpenChange() {
	const router = useRouter();
	const [open, setOpen] = useState(true);

	const onOpenChange = useCallback(
		(open: boolean) => {
			setOpen(open);
			if (!open) {
				router.back();
			}
		},
		[router],
	);

	const onClose = useCallback(() => {
		setOpen(false);
		router.back();
	}, [router]);

	return [open, onOpenChange, onClose] as const;
}
