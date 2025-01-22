import { MoreHorizontal } from 'lucide-react';
import { fetchAnimals } from '@/lib/fetchers/fetch-animals';
import { Animal } from '@/lib/types/entities/animal';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
						{animal.species?.cientific_name}
					</p>
				</div>

				<Button size="icon">
					<MoreHorizontal />
				</Button>
			</div>

			<div className="mt-2 text-sm text-gray-700 flex justify-between">
				<p>
					<span className="font-semibold">Idade:</span> {'Adulto'}
				</p>
				<p>
					<span className="font-semibold">Peso:</span> {`300 kg`}
				</p>
			</div>

			<div className="mt-3 text-sm text-gray-700">
				<p>
					<span className="font-semibold">Microchip:</span>{' '}
					{animal.mark_number || 'N/A'}
				</p>
				<p>
					<span className="font-semibold">Anilha:</span>{' '}
					{animal.mark_number || 'N/A'}
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
