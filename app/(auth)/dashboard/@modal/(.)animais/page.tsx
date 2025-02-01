import { fetchEnclosures } from '@/lib/fetchers/fetch-enclosures';
import { fetchAnimal } from '@/lib/fetchers/fetch-animals';
import { fetchImportRecords } from '@/lib/fetchers/fetch-imports';
import { Animal } from '@/lib/types/schemas/animal.schema';
import { AGE_VALUE } from '@/lib/types/maps/animal-age';
import { GENDER_VALUE } from '@/lib/types/maps/animal-gender';
import AnimalsForm from './form';

interface ModalParams {
	searchParams: Promise<{
		type?: 'import' | 'default';
		animal_id?: string;
		/** @desc id is the import id when its present */
		id?: string;
	}>;
}

export default async function Page({ searchParams }: ModalParams) {
	const { type = 'default', animal_id = '', id = '' } = await searchParams;
	const enclosuresPromise = fetchEnclosures();

	let animal: Partial<Animal> | undefined = undefined;

	if (animal_id && type === 'import' && id) {
		const importRecords = await fetchImportRecords(id);
		const record = importRecords.animals.find((a) => a.id === animal_id);

		animal = {
			id: record?.id,
			age: record?.age ? AGE_VALUE[record.age] : undefined,
			born_date: record?.born_date,
			gender: record?.gender ? GENDER_VALUE[record.gender] : undefined,
			origin: record?.origin,
			landing_at: record?.landing_at,
			microchip_code: record?.microchip_code,
			washer_code: record?.washer_code,
			name: record?.name,
			observation: record?.observation,
			enclosure_id: record?.enclosure_id,
			species_id: record?.species_id,
		};
	} else if (animal_id && type === 'default') {
		animal = await fetchAnimal({ animal_id });
	}

	const enclosures = await enclosuresPromise;
	return (
		<AnimalsForm
			enclosures={enclosures.enclosures}
			partialAnimal={animal}
			isImport={type === 'import'}
		/>
	);
}
