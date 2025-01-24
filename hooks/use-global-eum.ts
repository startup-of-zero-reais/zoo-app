import { useEffect } from 'react';

export function useGlobalErrorMonitor() {
	useEffect(() => {
		const handleError = (event: ErrorEvent) => {
			console.error('Erro:', event.message);
			fetch(`/app/api/eum/report`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					error: event.message,
					stack: event.error?.stack,
				}),
			});
		};

		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			console.error('Promise rejeitada:', event.reason);
			fetch(`/app/api/eum/report`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					error: event.reason?.message || 'Unhandled Promise',
					stack: event.reason?.stack,
				}),
			});
		};

		window.addEventListener('error', handleError);
		window.addEventListener('unhandledrejection', handleUnhandledRejection);

		return () => {
			console.log('NOT MONITORING');
			window.removeEventListener('error', handleError);
			window.removeEventListener(
				'unhandledrejection',
				handleUnhandledRejection,
			);
		};
	}, []);
}
