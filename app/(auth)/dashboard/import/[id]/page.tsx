import { fetchImportRecords } from '@/lib/fetchers/fetch-imports';
import { formatToBR } from '@/lib/functions/dates';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface ImportRecordsPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ImportRecordsPage({
	params,
}: ImportRecordsPageProps) {
	const { id } = await params;

	const { animals, species, enclosures } = await fetchImportRecords(id);

	return (
		<div className="grid gap-4">
			{enclosures.length > 0 && (
				<div className="grid">
					<h2 className="text-lg font-semibold py-4">Recintos</h2>

					<div className="grid grid-cols-2 items-center border p-2">
						<span className="text-sm font-semibold">Identificação</span>
						<span className="text-sm font-semibold">Erro</span>
					</div>

					{enclosures.map((enclosure) => (
						<div
							className="grid grid-cols-2 items-center border-x last:border-b even:bg-muted-foreground/10 hover:bg-muted-foreground/20 p-2"
							key={enclosure.id}
						>
							<span className="text-sm">{enclosure.identification}</span>
							<span className="text-sm">{enclosure.reason || 'N/A'}</span>
						</div>
					))}
				</div>
			)}

			{species.length > 0 && (
				<div className="grid">
					<h2 className="text-lg font-semibold py-4">Espécies</h2>

					<div className="grid grid-cols-5 items-center border p-2">
						<span className="text-sm font-semibold">Nome comum</span>
						<span className="text-sm font-semibold">Nome científico</span>
						<span className="text-sm font-semibold">Ordem taxonômica</span>
						<span className="text-sm font-semibold">Classe taxonômica</span>
						<span className="text-sm font-semibold">Erro</span>
					</div>

					{species.map((s) => (
						<div
							className="grid grid-cols-5 items-center border-x last:border-b even:bg-muted-foreground/10 hover:bg-muted-foreground/20 p-2"
							key={s.id}
						>
							<span className="text-sm">{s.common_name}</span>
							<span className="text-sm">{s.scientific_name}</span>
							<span className="text-sm">{s.taxonomic_order}</span>
							<span className="text-sm">{s.kind}</span>
							<span className="text-sm">{s.reason || 'N/A'}</span>
						</div>
					))}
				</div>
			)}

			{animals.length > 0 && (
				<div className="grid">
					<h2 className="text-lg font-semibold py-4">Animais</h2>

					<div className="grid grid-cols-8 items-center border p-2">
						<span className="text-sm font-semibold">Nome do animal</span>
						<span className="text-sm font-semibold">Data de chegada</span>
						<span className="text-sm font-semibold">Origem</span>
						<span className="text-sm font-semibold">Sexo</span>
						<span className="text-sm font-semibold">Nascimento</span>
						<span className="text-sm font-semibold">Obs.</span>
						<span className="text-sm font-semibold">Marcação</span>
						<span className="text-sm font-semibold">Erro</span>
					</div>

					{animals.map((a) => (
						<div
							className="grid grid-cols-8 items-center border-x last:border-b even:bg-muted-foreground/10 hover:bg-muted-foreground/20 p-2"
							key={a.id}
						>
							<span className="text-sm">{a.name}</span>
							<span className="text-sm">{formatToBR(a.landing_at)}</span>
							<span className="text-sm">{a.origin}</span>
							<span className="text-sm">{a.gender}</span>
							<span className="text-sm">
								{a.age || formatToBR(a.born_date)}
							</span>
							<span className="text-sm">{a.observation}</span>
							<span className="text-sm">
								{a.washer_code || a.microchip_code}
							</span>
							<div className="block w-full text-nowrap overflow-x-hidden text-ellipsis text-destructive">
								<TooltipProvider delayDuration={100}>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="text-sm">{a.reason}</span>
										</TooltipTrigger>
										<TooltipContent>{a.reason}</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
