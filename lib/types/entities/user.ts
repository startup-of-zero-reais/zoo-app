import type { Timestamps } from './base';

interface BaseUser {
	id: string;
	name: string;
	email: string;
	email_verified_at?: string;
	source?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateUser extends BaseUser {}

export interface User extends BaseUser, Timestamps {
	email_verified_at: string;
}
