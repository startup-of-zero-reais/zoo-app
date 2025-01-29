'use client';

import React, { createContext, useContext, useMemo } from 'react';
import {
	CheckSquare2,
	Trash2,
	Upload as UploadIcon,
	XSquare,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Upload, useUpload } from '@/hooks/use-upload';

interface UploadContextParams {
	startUpload(upload: Upload, token: string): void;
	enqueueUpload(file: File): void;
	uploads: Upload[];
	state: 'waiting' | 'uploading';
}

const UploadContext = createContext<UploadContextParams>(null!);

export default function UploadBoundary({
	children,
}: {
	children: React.ReactNode;
}) {
	const { state, startUpload, uploads, enqueueUpload, dequeueUpload } =
		useUpload();

	const memoState = useMemo(
		() => ({
			startUpload,
			enqueueUpload,
			dequeueUpload,
			uploads,
			state,
		}),
		[state, uploads, startUpload, enqueueUpload, dequeueUpload],
	);

	return (
		<UploadContext.Provider value={memoState}>
			{children}

			{uploads.length > 0 && (
				<div className="fixed bottom-4 right-4 shadow-md drop-shadow-lg bg-white p-4 animate-fade-in w-96 flex flex-col gap-2 transition-all">
					{uploads.map((upload) => (
						<div
							key={upload.id}
							className="grid grid-cols-[1fr,1fr,auto] items-center gap-4 transition-all animate-slide-up-fade"
						>
							<TooltipProvider delayDuration={100}>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="max-w-72 overflow-x-hidden text-ellipsis text-nowrap text-sm">
											{upload.file.name}
										</span>
									</TooltipTrigger>
									<TooltipContent>{upload.file.name}</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<div>
								{upload.status === 'prepared' && (
									<span className="text-sm text-muted-foreground">
										Aguardando envio
									</span>
								)}

								{upload.status === 'uploading' && (
									<Progress value={upload.progress} />
								)}

								{upload.status === 'completed' && (
									<div className="flex gap-2 items-center text-primary text-sm">
										<CheckSquare2 className="text-primary" />
										Completado!
									</div>
								)}

								{upload.status === 'error' && (
									<TooltipProvider delayDuration={200}>
										<Tooltip defaultOpen>
											<TooltipTrigger className="flex items-center gap-2 text-destructive">
												<XSquare className="text-destructive" /> Não enviado
											</TooltipTrigger>
											<TooltipContent>
												<span className="text-sm text-destructive">
													{upload.error || 'Algum erro ocorreu!'}
												</span>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</div>

							{upload.status === 'prepared' && (
								<Button
									onClick={() => startUpload(upload, 'some-token')}
									size={'icon'}
									disabled={state === 'uploading'}
								>
									<UploadIcon />
								</Button>
							)}

							{upload.status === 'error' && (
								<Button
									onClick={() => dequeueUpload(upload)}
									size={'icon'}
									variant="destructive"
								>
									<Trash2 />
								</Button>
							)}
						</div>
					))}
				</div>
			)}
		</UploadContext.Provider>
	);
}

export function useUploadBoundary() {
	return useContext(UploadContext);
}
