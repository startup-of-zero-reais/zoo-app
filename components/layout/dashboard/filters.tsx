'use client';

import { useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FetchSpeciesResponse } from '@/lib/types/schemas/responses/fetch-species';
import { FetchEnclosuresResponse } from '@/lib/types/schemas/responses/fetch-enclosures';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { SpeciesFilter } from './species.filter';
import { EnclosuresFilter } from './enclosures.filter';
import { SimpleCheckboxGroup } from './simple-checkbox-group';

interface FilterProps {
	species: FetchSpeciesResponse;
	enclosures: FetchEnclosuresResponse;
}

const GENDERS = [
	{ id: 'male', label: 'Masculino' },
	{ id: 'female', label: 'Feminino' },
	{ id: 'undefined', label: 'Indefinido' },
];

const AGES = [
	{ id: 'neonate', label: 'Neonato' },
	{ id: 'cub', label: 'Filhote' },
	{ id: 'young', label: 'Jovem' },
	{ id: 'adult', label: 'Adulto' },
	{ id: 'senile', label: 'Senil' },
];

export function Filters({ species, enclosures }: FilterProps) {
	const currentParams = useSearchParams();
	const searchParams = useRef(new URLSearchParams(currentParams));
	const router = useRouter();

	const setParams = (field: string) => (ids: string[]) => {
		if (ids.length > 0) {
			searchParams.current.set(field, ids.toString());
		} else {
			searchParams.current.delete(field);
		}
	};

	const onSelectSpecies = useCallback(setParams('species'), []);
	const onSelectEnclosures = useCallback(setParams('enclosures'), []);
	const onSelectGenders = useCallback(setParams('genders'), []);
	const onSelectAges = useCallback(setParams('ages'), []);

	const handleFilter = useCallback(() => {
		router.push(`/dashboard?${searchParams.current.toString()}`);
	}, [router]);

	const clearFilters = useCallback(() => {
		searchParams.current = new URLSearchParams();
		window.location.assign('/app/dashboard');
	}, []);

	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="filters">
				<AccordionTrigger>Filtrar</AccordionTrigger>

				<AccordionContent className="data-[state=open]:my-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 transition-all">
					<SpeciesFilter species={species.species} onSelect={onSelectSpecies} />

					<EnclosuresFilter
						enclosures={enclosures.enclosures}
						onSelect={onSelectEnclosures}
					/>

					<div className="grid gap-2">
						<SimpleCheckboxGroup
							items={GENDERS}
							label="Gêneros"
							onSelect={onSelectGenders}
							searchParamKey="genders"
						/>

						<SimpleCheckboxGroup
							items={AGES}
							label="Idade"
							onSelect={onSelectAges}
							className="h-36"
							searchParamKey="ages"
						/>
					</div>

					<Button variant="secondary" onClick={clearFilters}>
						<X />
						Limpar filtros
					</Button>

					<Button
						className="lg:col-start-2 xl:col-start-3"
						onClick={handleFilter}
					>
						<Search /> Pesquisar
					</Button>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
