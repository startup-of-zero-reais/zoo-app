import { fetchEnclosures } from '@/lib/fetchers/fetch-enclosures';
import AnimalsForm from './form';

export default async function Page() {
	const enclosures = await fetchEnclosures();
	return <AnimalsForm enclosures={enclosures.enclosures} />;
}
