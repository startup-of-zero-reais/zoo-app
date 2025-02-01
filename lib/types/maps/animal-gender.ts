export const MALE = 'male';
export const FEMALE = 'female';
export const UNDEFINED = 'undefined';

export const GENDER_LABEL = {
	[MALE]: 'Masculino',
	[FEMALE]: 'Feminino',
	[UNDEFINED]: 'Indefinido',
} as const;

export const GENDER_VALUE = {
	Masculino: MALE,
	Feminino: FEMALE,
	Indefinido: UNDEFINED,
} as const;
