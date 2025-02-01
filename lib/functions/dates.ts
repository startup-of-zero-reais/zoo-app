import { format } from 'date-fns';

const BR_FORMAT = "dd 'de' MMM 'de' yyyy";

export function formatToBR(date?: Date | string) {
	if (!date) {
		return '';
	}

	return format(date, BR_FORMAT);
}

export function toLocalISOString(date?: Date, timezoneOffset: boolean = false) {
	if (!date) {
		return '';
	}

	let localDate = new Date(date.getTime());
	if (timezoneOffset) {
		localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	}

	localDate.setSeconds(0);
	localDate.setMilliseconds(0);
	return localDate.toISOString().slice(0, -1);
}
