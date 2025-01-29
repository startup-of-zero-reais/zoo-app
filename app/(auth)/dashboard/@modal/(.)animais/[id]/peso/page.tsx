import WeightForm from './form';

interface WeightPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function WeightPage({ params }: WeightPageProps) {
	const { id } = await params;
	return <WeightForm animal_id={id} />;
}
