'use client';

import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		fetch(`/app/api/eum/report`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ error: error.message, stack: error.stack }),
		});
	}, [error.message, error.stack]);

	return (
		<html lang="en">
			<body className={`antialiased`}>
				<h2 className="text-xl font-semibold">Oops, algo de errado!</h2>
				<button onClick={() => reset()}>Tente novamente</button>
				<Toaster richColors />
			</body>
		</html>
	);
}
