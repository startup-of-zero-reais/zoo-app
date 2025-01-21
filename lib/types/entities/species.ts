import { Timestamps } from './base';

export interface BaseSpecies {
	id: string;
	cientific_name: string;
	common_name: string;
	kind: string;
	taxonomic_order: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateSpecies extends BaseSpecies {}

export interface Species extends BaseSpecies, Timestamps {}
