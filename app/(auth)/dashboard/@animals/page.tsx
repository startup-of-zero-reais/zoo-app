import Link from 'next/link';
import {
	ChartLine,
	MoreHorizontal,
	PenSquare,
	Trash,
	Weight,
} from 'lucide-react';
import { fetchAnimals } from '@/lib/fetchers/fetch-animals';
import { Animal } from '@/lib/types/schemas/animal.schema';
import { AGE_LABEL } from '@/lib/types/maps/animal-age';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default async function AnimalsPage() {
	const animals = await fetchAnimals({ rel: ['enclosure', 'species'] });
	const totalChars = animals.total >= 1 ? `(${animals.total}) ` : '';

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>{totalChars}Animais</CardTitle>
					<CardDescription>
						Lista dos animais no estabelecimento
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2">
						{animals.animals.map((animal) => (
							<AnimalCard animal={animal} key={animal.id} />
						))}
					</div>
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</div>
	);
}

interface AnimalCardProps {
	animal: Animal;
}

function AnimalCard({ animal }: AnimalCardProps) {
	const bornDate = animal.born_date;
	const ageFromBorn = new Date().getFullYear() - bornDate.getFullYear();
	const age = animal.age ? AGE_LABEL[animal.age] : `${ageFromBorn} ano(s)`;

	const weight = animal.weights?.at(0)?.weight;
	const showWeight = weight ? `${weight}kg` : 'N/A';

	return (
		<div className="bg-white shadow-md rounded-lg border border-gray-200 p-4 relative flex flex-col">
			<div className="flex gap-2">
				<div className="flex-1">
					<h2 className="text-lg font-semibold text-gray-800">
						{animal.species?.common_name}
					</h2>

					<div className="text-xs uppercase text-gray-600">
						{animal.species?.kind} | {animal.species?.taxonomic_order}
					</div>

					<p className="italic text-gray-500 text-sm mt-1">
						{animal.species?.scientific_name}
					</p>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="bg-card z-10 max-w-44 shadow-lg drop-shadow-lg">
						<DropdownMenuLabel>Ações</DropdownMenuLabel>
						<DropdownMenuSeparator className="w-full bg-accent translate-x-1" />
						<DropdownMenuItem>
							<Button className="w-full" variant="link" asChild>
								<Link href="#">
									<PenSquare /> Editar
								</Link>
							</Button>
						</DropdownMenuItem>

						<DropdownMenuItem>
							<Button className="w-full" variant="link" asChild>
								<Link href={`/dashboard/animais/${animal.id}/peso`}>
									<Weight /> Registrar peso
								</Link>
							</Button>
						</DropdownMenuItem>

						<DropdownMenuItem>
							<Button className="w-full" variant="link" asChild>
								<Link href={`/dashboard/animal/${animal.id}/historico`}>
									<ChartLine /> Historico de peso
								</Link>
							</Button>
						</DropdownMenuItem>

						<DropdownMenuItem>
							<Button className="w-full" variant="destructive" asChild>
								<Link href="#">
									<Trash /> Deletar
								</Link>
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="mt-2 text-sm text-gray-700 flex justify-between">
				<p>
					<span className="font-semibold">Idade:</span> {age}
				</p>
				<p>
					<span className="font-semibold">Peso:</span> {showWeight}
				</p>
			</div>

			<div className="mt-3 text-sm text-gray-700">
				<p>
					<span className="font-semibold">Microchip:</span>{' '}
					{animal.microchip_code || 'N/A'}
				</p>
				<p>
					<span className="font-semibold">Anilha:</span>{' '}
					{animal.washer_code || 'N/A'}
				</p>
			</div>

			{animal.enclosure?.identification && (
				<p className="mt-3 text-gray-700 text-sm">
					<span className="font-semibold">Recinto:</span>{' '}
					{animal.enclosure?.identification}
				</p>
			)}

			{animal.name && (
				<p className="mt-2 text-gray-900 font-semibold text-lg">
					🐾 {animal.name}
				</p>
			)}
		</div>
	);
}
