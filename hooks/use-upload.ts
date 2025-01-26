import { useCallback, useEffect, useRef, useState } from 'react';

const CHARSET =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
// const ENDPOINT = 'http://localhost:3000/app/api/upload';
const ENDPOINT = 'http://localhost:8080/api/v1/upload';

export interface Upload {
	id: string;
	progress: number;
	status: 'prepared' | 'uploading' | 'completed' | 'error';
	file: File;
	error?: string;
}

export function useUpload() {
	const [state, setState] = useState<'waiting' | 'uploading'>('waiting');
	const [uploads, setUploads] = useState<Array<Upload>>([]);
	const workerRef = useRef<Worker>(null);

	useEffect(() => {
		workerRef.current = new Worker(
			new URL('../public/js/workers/upload.js', import.meta.url),
		);

		return () => {
			workerRef.current!.terminate();
		};
	}, []);

	const enqueueUpload = useCallback((file: File) => {
		const uploadId = generateRandomID();
		setUploads((prev) => [
			...prev,
			{
				id: uploadId,
				file,
				progress: 0,
				status: 'prepared',
			},
		]);
	}, []);

	const dequeueUpload = useCallback((upload: Upload) => {
		setUploads((prev) => {
			const idx = prev.findIndex((u) => u.id === upload.id);
			if (idx >= 0) {
				prev.splice(idx, 1);
			}

			return [...prev];
		});
	}, []);

	const startUpload = useCallback(
		(upload: Upload, token: string) => {
			if (state === 'uploading') {
				return;
			}

			setState('uploading');
			const uploadId = upload.id;

			setUploads((prev) =>
				prev.map((u) =>
					u.id === upload.id ? { ...u, status: 'uploading' } : u,
				),
			);

			workerRef.current!.postMessage({
				file: upload.file,
				chunkSize: CHUNK_SIZE,
				uploadId,
				endpoint: ENDPOINT,
				token,
				filename: upload.file.name,
			});

			workerRef.current!.onmessage = (event) => {
				if (event.data.progress !== undefined) {
					setUploads((prev) =>
						prev.map((u) =>
							u.id === uploadId ? { ...u, progress: event.data.progress } : u,
						),
					);
				}

				if (event.data.error) {
					setUploads((prev) =>
						prev.map((u) =>
							u.id === uploadId
								? { ...u, status: 'error', error: event.data.error }
								: u,
						),
					);
					setState('waiting');
				}

				if (event.data.completed) {
					setUploads((prev) =>
						prev.map((u) =>
							u.id === uploadId ? { ...u, status: 'completed' } : u,
						),
					);

					setTimeout(() => {
						setUploads((prev) => {
							const idx = prev.findIndex((up) => up.id === uploadId);
							if (idx >= 0) {
								prev.splice(idx, 1);
							}

							return [...prev];
						});
						setState('waiting');
					}, 3000);
				}
			};
		},
		[state],
	);

	return { state, uploads, startUpload, enqueueUpload, dequeueUpload };
}

function generateRandomID(length = 10) {
	const randomValues = new Uint8Array(length);
	crypto.getRandomValues(randomValues);

	return Array.from(randomValues, (v) => CHARSET[v % CHARSET.length]).join('');
}
