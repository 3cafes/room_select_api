const moment = require('moment');
const { Reservation } = require('../database');
const roomAPI = require('./room');

const DATE_FORMAT = 'YYYY-MM-DD';
const HOUR_FORMAT = 'HH:mm';
const OPENING_HOUR = '09:00';
const CLOSING_HOUR = '23:00';
const MIN_RESERVATION_PERIOD = '01:20';

const opening = moment(OPENING_HOUR, HOUR_FORMAT);
const closing = moment(CLOSING_HOUR, HOUR_FORMAT);
const min_reservation = moment(MIN_RESERVATION_PERIOD, HOUR_FORMAT);

function format_is_valid(reservation) {
	if (
		reservation &&
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

function minutes_are_valid(from, to) {
	return (
		(min_reservation.minutes() == 0 &&
			from.minutes() == 0 &&
			to.minutes() == 0) ||
		(from.minutes() % min_reservation.minutes() == 0 &&
			to.minutes() % min_reservation.minutes() == 0)
	);
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
		minutes_are_valid(from, to) &&
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
	return { success: true, message: 'ok' };
}

async function get_reservations(room_id, date) {
	return await Reservation.find({
		room: room_id,
		date: date,
	});
}

async function is_room_available(room_id, reservation) {
	const reservations = await get_reservations(room_id, reservation.date);
	reservations.sort((a, b) =>
		moment(a.from, HOUR_FORMAT).isBefore(moment(b.from, HOUR_FORMAT))
	);
	if (reservations.length < 1) return true;
	const from = moment(reservation.from, HOUR_FORMAT);
	const to = moment(reservation.to, HOUR_FORMAT);
	//check time slot

	return false;
}

async function create_reservation(room_id, reservation) {
	if (!(await is_room_available(room_id, reservation)))
		throw 'room is not available';
	try {
		const new_reservation = new Reservation({
			room: room_id,
			date: reservation.date,
			from: reservation.from,
			to: reservation.to,
		});
		await new_reservation.save();
	} catch (e) {
		throw `can't save reservation ${e.toString()}`;
	}
}

async function reserve(room_id, reservation) {
	//check room id ?
	const { success, message } = await is_valid(reservation);
	if (!success) throw message;
	await create_reservation(room_id, reservation);
	//dump .json
}

module.exports = {
	is_valid,
	is_room_available,
	create_reservation,
	get_reservations,
	reserve,
};
