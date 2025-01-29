import Link from 'next/link';
import { Trash } from 'lucide-react';
import { fetchImports } from '@/lib/fetchers/fetch-imports';
import Upload from '@/components/helpers/upload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default async function Page() {
	const { imports } = await fetchImports();
	const PROGRESS = {
		sending: 25,
		received: 25,
		processing: 75,
		completed: 100,
		error: 0,
	};

	return (
		<div className="grid gap-4">
			<h1 className="text-xl font-semibold">Importar planilha</h1>

			<p className="text-muted-foreground">
				Para importar a planilha, clique abaixo, escolha a planilha e adicione
				na fila de importação
			</p>

			<div className="grid lg:grid-cols-4 gap-4 items-center">
				<Upload />

				<p>
					<strong>Dica:</strong> Inicie a importação pela planilha de{' '}
					<span className="text-primary">recintos</span> e de{' '}
					<span className="text-primary">espécies</span>. Por último, a de{' '}
					<span className="text-primary">animais</span>.
				</p>
			</div>

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
							<div className="flex items-center gap-4">
								<Button variant="outline" asChild>
									<Link href={`/dashboard/import/${importState.id}`}>
										Abrir arquivo
									</Link>
								</Button>

								<Button variant="destructive">
									<Trash /> Deletar
								</Button>
							</div>
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
