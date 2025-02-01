export const NEONATE = 'neonate';
export const CUB = 'cub';
export const YOUNG = 'young';
export const ADULT = 'adult';
export const SENILE = 'senile';

export const AGE_LABEL = {
	[NEONATE]: 'Neonato',
	[CUB]: 'Filhote',
	[YOUNG]: 'Jovem',
	[ADULT]: 'Adulto',
	[SENILE]: 'Senil',
} as const;

export const AGE_VALUE = {
	Neonato: NEONATE,
	Filhote: CUB,
	Jovem: YOUNG,
	Adulto: ADULT,
	Senil: SENILE,
} as const;
