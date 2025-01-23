import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { fetchAnimalWeights } from '@/lib/fetchers/fetch-animals';
import { WeightsChart } from './chart';

interface WeightHistoryProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function WeightHistory({ params }: WeightHistoryProps) {
	const { id } = await params;
	const history = await fetchAnimalWeights({
		id,
		rel: ['animal.species'],
	});

	return (
		<div className="grid grid-cols-4 gap-4">
			<div className="col-span-3">
				<WeightsChart history={history} id={id} />
			</div>
			{history.weights.length > 0 && (
				<div className="border p-4 flex flex-col gap-2">
					<div className="grid grid-cols-2 p-2">
						<span className="font-semibold">Peso</span>
						<span className="font-semibold">Registrado em</span>
					</div>

					{[...history.weights].reverse().map((weight) => (
						<div
							className="grid grid-cols-2 border p-2 items-center hover:bg-muted-foreground/10 transition-all"
							key={weight.id}
						>
							<span className="font-medium text-center">{weight.weight}kg</span>
							<span className="text-sm text-muted-foreground text-center">
								{formatDistanceToNow(weight.created_at, {
									locale: ptBR,
									addSuffix: true,
								})}
							</span>
						</div>
					))}
				</div>
			)}{' '}
		</div>
	);
}
