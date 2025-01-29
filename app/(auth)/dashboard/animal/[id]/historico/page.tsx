import { format, formatDistanceToNow } from 'date-fns';
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
		rel: ['animal.species', 'user'],
	});

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			<div className="lg:col-span-2 xl:col-span-3">
				<WeightsChart history={history} id={id} />
			</div>
			{history.weights.length > 0 && (
				<div className="border p-4 flex flex-col gap-2">
					<div className="grid grid-cols-2 p-2">
						<span className="font-semibold text-center text-sm xl:text-base">
							Peso
						</span>
						<span className="font-semibold text-center text-sm xl:text-base">
							Registrado
						</span>
					</div>

					{history.weights.map((weight) => (
						<div
							className="grid grid-cols-2 border p-2 items-center hover:bg-muted-foreground/10 transition-all"
							key={weight.id}
						>
							<span className="font-medium text-center">{weight.weight}kg</span>
							<div className="flex flex-col gap-2">
								<span className="text-sm text-neutral-700 text-center">
									{formatDistanceAfterADay(weight.created_at)}
								</span>

								<span className="font-medium text-center text-xs text-muted-foreground text-ellipsis overflow-hidden text-nowrap">
									{truncateName(weight.user?.name)}
								</span>
							</div>
						</div>
					))}
				</div>
			)}{' '}
		</div>
	);
}

function formatDistanceAfterADay(date: Date) {
	const DAY = 60 * 60 * 24 * 1000;
	const moreThanADay = date.getTime() > Date.now() - DAY;
	if (moreThanADay) {
		return formatDistanceToNow(date, {
			locale: ptBR,
			addSuffix: true,
		});
	}

	return format(date, 'dd MMM yyyy');
}

function truncateName(
	name: string = '',
	options: { truncatePartIn: number; truncateNameIn: number } = {
		truncatePartIn: 10,
		truncateNameIn: 20,
	},
) {
	if (!name) {
		return 'Não identificado';
	}

	const parts = name.split(' ');
	const { truncateNameIn, truncatePartIn } = options;

	const allowedParts: string[] = [];
	parts.forEach((part) => {
		const totalLength = allowedParts.join(' ').length + part.length;
		if (part.length < truncatePartIn && totalLength < truncateNameIn) {
			allowedParts.push(part);
		}
	});

	return allowedParts.join(' ');
}
