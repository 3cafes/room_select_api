const moment = require('moment');
const roomAPI = require('./room');

const DATE_FORMAT = 'YYYY-MM-DD';
const HOUR_FORMAT = 'HH:mm';
const OPENING_HOUR = '09:00';
const CLOSING_HOUR = '23:00';
const MIN_RESERVATION_PERIOD = '01:30';

const opening = moment(OPENING_HOUR, HOUR_FORMAT);
const closing = moment(CLOSING_HOUR, HOUR_FORMAT);
const min_reservation = moment(MIN_RESERVATION_PERIOD, HOUR_FORMAT);

function format_is_valid(reservation) {
	if (
		reservation &&
		reservation.room &&
		reservation.date &&
		reservation.from &&
		reservation.to &&
		moment(reservation.date, DATE_FORMAT, true).isValid() &&
		moment(reservation.from, HOUR_FORMAT, true).isValid() &&
		moment(reservation.to, HOUR_FORMAT, true).isValid()
	) {
		return true;
	}
	return false;
}

function hours_are_valid(from_str, to_str) {
	const from = moment(from_str, HOUR_FORMAT, true);
	const to = moment(to_str, HOUR_FORMAT, true);

	const period_h = to.hours() - from.hours();
	const period_m = to.minutes() - from.minutes();
	const period = moment(`${period_h}:${period_m}`, HOUR_FORMAT);

	if (
		from.isBefore(to) &&
		period.isSameOrAfter(min_reservation) &&
		from.isBetween(opening, closing, undefined, '[]') &&
		to.isBetween(opening, closing, undefined, '[]')
	) {
		return true;
	}
	return false;
}

async function is_valid(reservation) {
	console.log(reservation);
	if (!format_is_valid(reservation)) {
		return { success: false, message: 'invalid format' };
	}
	if (!hours_are_valid(reservation.from, reservation.to)) {
		return { success: false, message: 'invalid hours' };
	}
	const room = await roomAPI.find(reservation.room);
	if (!room) {
		return { success: false, message: 'invalid room' };
	}
	return { success: true, message: 'ok' };
}

module.exports = {
	DATE_FORMAT,
	HOUR_FORMAT,
	is_valid,
};
