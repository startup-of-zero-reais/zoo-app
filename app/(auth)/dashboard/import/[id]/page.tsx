import { Lock, Trash } from 'lucide-react';
import { fetchImportRecords } from '@/lib/fetchers/fetch-imports';
import { fetchSpecies } from '@/lib/fetchers/fetch-species';
import { fetchEnclosures } from '@/lib/fetchers/fetch-enclosures';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnimalsList from './animals';
import EnclosuresList from './enclosures';
import SpeciesList from './species';

interface ImportRecordsPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ImportRecordsPage({
	params,
}: ImportRecordsPageProps) {
	const { id } = await params;

	const [validSpecies, validEnclosures, { animals, species, enclosures }] =
		await Promise.all([
			fetchSpecies(),
			fetchEnclosures(),
			fetchImportRecords(id),
		]);

	if (!animals.length && !species.length && !enclosures.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Tudo pronto!</CardTitle>
					<CardDescription>Todos os dados já foram importados!</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<p className="text-sm">
						<Lock className="inline-block mr-2" size={14} />
						Você pode apagar o arquivo com segurança{' '}
					</p>

					<Button variant="destructive">
						<Trash /> Excluir
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-4">
			<EnclosuresList enclosures={enclosures} />
			<SpeciesList species={species} />
			<AnimalsList
				animals={animals}
				species={validSpecies}
				enclosures={validEnclosures}
			/>
		</div>
	);
}
