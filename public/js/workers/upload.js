self.onmessage = async (event) => {
	const { file, chunkSize, uploadId, endpoint, filename } = event.data;

	const totalChunks = Math.ceil(file.size / chunkSize);
	for (let i = 0; i < totalChunks; i++) {
		const start = i * chunkSize;
		const end = Math.min(start + chunkSize, file.size);
		const chunk = file.slice(start, end);

		const formData = new FormData();
		formData.append('chunk', chunk);
		formData.append('upload_id', uploadId);
		formData.append('chunk_index', i);
		formData.append('total_chunks', totalChunks);
		formData.append('filename', filename);

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error(`Erro no chunk ${i}: ${response.statusText}`);
			}

			self.postMessage({ progress: ((i + 1) / totalChunks) * 100 });
		} catch (error) {
			self.postMessage({ error: error.message });
			return;
		}
	}

	self.postMessage({ completed: true });
};
