'use client';

import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, UploadIcon } from 'lucide-react';
import { useUploadBoundary } from '@/components/layout/upload/upload-boundary';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Upload() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { enqueueUpload } = useUploadBoundary();

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			setSelectedFile(e.target.files?.[0] || null),
		[],
	);

	const handleUpload = useCallback(() => {
		if (selectedFile) {
			enqueueUpload(selectedFile);
			setSelectedFile(null);
			inputRef.current!.value = '';
		}
	}, [selectedFile, enqueueUpload]);

	return (
		<div className="space-y-2 border p-4 flex flex-col max-w-72">
			<Label
				htmlFor="file"
				className="hover:cursor-pointer border border-dashed flex items-center"
			>
				<span className="p-2 inline-block">
					<UploadCloud className="inline-block mr-2" />
					Enviar planilha
				</span>

				<input
					ref={inputRef}
					type="file"
					id="file"
					onChange={handleFileChange}
					className="hidden"
				/>
			</Label>

			{selectedFile && (
				<span className="text-sm text-nowrap overflow-x-hidden text-ellipsis text-muted-foreground transition-all animate-fade-in">
					{selectedFile.name}
				</span>
			)}

			<Button onClick={handleUpload} disabled={!selectedFile}>
				<UploadIcon />
				Adicionar
			</Button>
		</div>
	);
}
