import { Timestamps } from './base';
import { Enclosure } from './enclosure';
import { Species } from './species';

export interface BaseAnimal {
	id: string;
	name: string;
	mark_type: 'microchip' | 'washer';
	mark_number: string;
	landing_at: Date;
	origin: string;
	age: Date;
	species_id: string;
	enclosures_id: string;
}

export interface Animal extends BaseAnimal, Timestamps {
	enclosure?: Enclosure;
	species?: Species;
}
