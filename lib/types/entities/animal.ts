import { Timestamps } from './base';
import { Enclosure } from './enclosure';
import { Species } from './species';

export type AgeTypes = 'neonate' | 'cub' | 'young' | 'adult' | 'senile';
export type GenderTypes = 'male' | 'female' | 'undefined';

export interface BaseAnimal {
	id: string;
	name: string;
	microchip_code: string;
	washer_code: string;
	landing_at: Date;
	origin: string;
	age: AgeTypes;
	born_date: Date;
	gender: GenderTypes;
	species_id: string;
	enclosures_id: string;
}

export interface Animal extends BaseAnimal, Timestamps {
	enclosure?: Enclosure;
	species?: Species;
}
