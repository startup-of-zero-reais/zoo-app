import { format } from 'date-fns';

const BR_FORMAT = "dd 'de' MMM 'de' yyyy";

export function formatToBR(date?: Date | string) {
	if (!date) {
		return '';
	}

	return format(date, BR_FORMAT);
}
