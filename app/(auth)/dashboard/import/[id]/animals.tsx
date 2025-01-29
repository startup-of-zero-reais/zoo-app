import { FetchImportRecordsResponse } from '@/lib/types/schemas/responses/fetch-imports';
import { formatToBR } from '@/lib/functions/dates';
import {
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
	Tooltip,
} from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

interface AnimalsListProps {
	animals: FetchImportRecordsResponse['animals'];
}

export default function AnimalsList({ animals }: AnimalsListProps) {
	if (animals.length === 0) {
		return null;
	}

	return (
		<div className="grid">
			<h2 className="text-lg font-semibold py-4">Animais</h2>

			<form>
				<div className="grid grid-cols-[auto,repeat(8,1fr)] items-center border p-2">
					<span className="text-sm font-semibold text-center px-2">
						<Checkbox value={'all'} />
					</span>
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
						className="grid grid-cols-[26px,repeat(8,1fr)] items-center px-2 border-x last:border-b even:bg-muted-foreground/10 hover:bg-muted-foreground/20 p-2"
						key={a.id}
					>
						<div className="px-2">
							<Checkbox value={a.id} />
						</div>
						<span className="text-sm">{a.name}</span>
						<span className="text-sm">{formatToBR(a.landing_at)}</span>
						<span className="text-sm">{a.origin}</span>
						<span className="text-sm">{a.gender}</span>
						<span className="text-sm">{a.age || formatToBR(a.born_date)}</span>
						<span className="text-sm">{a.observation}</span>
						<span className="text-sm">{a.washer_code || a.microchip_code}</span>
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
			</form>
		</div>
	);
}
