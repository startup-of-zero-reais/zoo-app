import { useEffect, useRef, useState } from 'react';

export function useDebounce<T = unknown>(value: T, delay = 1000) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		if (!timerRef.current) {
			timerRef.current = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = undefined;
			}
		};
	}, [value, delay]);

	return debouncedValue;
}
