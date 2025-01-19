import { Timestamps } from './base';

export interface BaseEnclosure {
	id: string;
	identification: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateEnclosure extends BaseEnclosure {}

export interface Enclosure extends BaseEnclosure, Timestamps {}
