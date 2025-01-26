import Link from 'next/link';
import { fetchImports } from '@/lib/fetchers/fetch-imports';
import Upload from '@/components/helpers/upload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default async function Page() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { imports } = (await fetchImports()) as Promise<any>;
	const PROGRESS = {
		sending: 25,
		received: 25,
		processing: 75,
		completed: 100,
		error: 0,
	};

	return (
		<div className="grid gap-4">
			<h1>Upload</h1>
			<Upload />

			<div className="flex flex-col gap-2">
				{imports.map((importState) => (
					<div
						className="border p-4 grid grid-cols-5 gap-4 items-center"
						key={importState.id}
					>
						<span className="col-span-2">{importState.filename}</span>

						{importState.state === 'sending' && (
							<span className="text-muted-foreground">Enviando</span>
						)}

						{importState.state === 'received' && (
							<span className="text-green-600">
								Enviado, aguardando processamento
							</span>
						)}

						{importState.state === 'processing' && (
							<span className="text-orange-400">Processando</span>
						)}

						{importState.state === 'completed' && (
							<span className="text-green-600">Processado</span>
						)}

						<Progress value={PROGRESS[importState.state]} />

						{importState.state === 'completed' && (
							<Button variant="link" asChild>
								<Link href={`/dashboard/import/${importState.id}`}>
									Importar
								</Link>
							</Button>
						)}

						{importState.state === 'error' && (
							<>
								<span className="text-destructive">Planilha com erro</span>
								<Button variant="destructive">Ver erros</Button>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
