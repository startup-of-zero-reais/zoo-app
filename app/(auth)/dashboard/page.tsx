import { fetchEnclosures } from '@/lib/fetchers/fetch-enclosures';
import { fetchSpecies } from '@/lib/fetchers/fetch-species';
import { Filters } from '@/components/layout/dashboard/filters';

export default async function DashboardPage({}) {
	const [enclosures, species] = await Promise.all([
		fetchEnclosures(),
		fetchSpecies(),
	]);

	return <Filters species={species} enclosures={enclosures} />;
}
