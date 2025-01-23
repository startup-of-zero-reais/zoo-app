'use client';

import Link from 'next/link';
import { PlusSquare, TrendingDown, TrendingUp } from 'lucide-react';
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { FetchAnimalWeightsResponse } from '@/lib/types/schemas/responses/fetch-animals';
import { Animal } from '@/lib/types/schemas/animal.schema';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface WeightsChartProps {
	id: string;
	history: FetchAnimalWeightsResponse;
}

const CHART_FORMAT = 'dd MMM yyyy';

export function WeightsChart({ id, history }: WeightsChartProps) {
	if (history.weights.length == 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Sem registro</CardTitle>
					<CardDescription>
						Registre um novo peso para esse animal
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Button asChild size="lg">
						<Link href={`/dashboard/animais/${id}/peso`}>
							<PlusSquare /> Registrar novo peso
						</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	const idx = history.weights.length - 1;
	const lastWeight = history.weights.at(idx)?.weight || 0;
	const animal = history.weights.at(0)?.animal;

	let progression = 'Nenhum registro';
	let percentage = 0;
	if (history.weights.length > 1) {
		const weightBefore = history.weights.at(idx - 1)?.weight || 0;

		percentage = (1 - weightBefore / lastWeight) * 100;

		progression =
			percentage >= 0
				? `aumentou em ${percentage.toFixed(1)}%`
				: `reduziu em ${percentage.toFixed(1)}%`;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Histórico de peso do animal</CardTitle>
				<CardDescription className="flex gap-2 items-center">
					{animal?.name || animal?.species?.common_name}
					<Separator orientation="vertical" className="h-4" />
					{animal?.species?.scientific_name}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer
					config={{
						desktop: {
							label: 'Peso',
							color: 'hsl(var(--chart-1))',
						},
					}}
				>
					<LineChart
						accessibilityLayer
						data={history.weights}
						margin={{
							top: 20,
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="created_at"
							tickMargin={8}
							tickFormatter={(value: Date) =>
								format(value, CHART_FORMAT, { locale: ptBR })
							}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" label="Peso" />}
						/>
						<Line
							dataKey="weight"
							type="linear"
							stroke="var(--color-desktop)"
							strokeWidth={2}
							dot={{
								fill: 'var(--color-desktop)',
							}}
							activeDot={{
								r: 6,
							}}
							name="Peso (kg)"
						>
							<LabelList
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
							/>
						</Line>
					</LineChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					O peso do animal {progression} desde a última pesagem{' '}
					{percentage >= 0 ? (
						<TrendingUp className="h-4 w-4" />
					) : (
						<TrendingDown className="h-4 w-4" />
					)}
				</div>
				<ShowingOf animal={animal!} lastWeight={lastWeight} />
			</CardFooter>
		</Card>
	);
}

function ShowingOf({
	animal,
	lastWeight,
}: {
	animal: Animal;
	lastWeight: number;
}) {
	const label = animal.name
		? `de ${animal.name}`
		: animal.microchip_code
			? `do animal marcado com ${animal.microchip_code}`
			: `do animal com a anilha ${animal.washer_code}`;

	return (
		<div className="leading-none text-muted-foreground">
			Mostrando a evolução de peso {label}.
			<strong className="block my-2">Peso atual: {lastWeight}kg</strong>
		</div>
	);
}
