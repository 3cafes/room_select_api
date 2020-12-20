const moment = require('moment');
const fs = require('fs/promises');
const path = require('path');
const { Reservation } = require('../database');
const roomAPI = require('./room');

const DATE_FORMAT = 'YYYY-MM-DD';
const HOUR_FORMAT = 'HH:mm';
const OPENING_HOUR = '09:00';
const CLOSING_HOUR = '23:00';
const MIN_RESERVATION_PERIOD = '01:00';

//dump file
const __basedir = path.dirname(require.main.filename);
const DUMP_BASE_FOLDER = path.resolve(__basedir, 'data', 'reservations');
const DUMP_FILENAME_HOUR_FORMAT = 'HH[h]mm';
const DUMP_FOLDER_DATE_FORMAT = 'YYYY-MM-DD';
const DUMP_JSON_DATE_FORMAT = 'DD MMMM YYYY';
const DUMP_JSON_HOUR_FORMAT = 'HH[h]mm';

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
		moment(a.from, HOUR_FORMAT).diff(moment(b.from, HOUR_FORMAT))
	);

	const from = moment(reservation.from, HOUR_FORMAT);
	const to = moment(reservation.to, HOUR_FORMAT);

	//this is working cause we asume that there is no overlapping data
	for (let i = -1; i < reservations.length; i++) {
		const end_prev_str = i < 0 ? OPENING_HOUR : reservations[i].to;
		const end_prev = moment(end_prev_str, HOUR_FORMAT);
		const start_next_str =
			i + 1 >= reservations.length ? CLOSING_HOUR : reservations[i + 1].from;
		const start_next = moment(start_next_str, HOUR_FORMAT);

		if (from.isSameOrAfter(end_prev) && to.isSameOrBefore(start_next)) {
			return true;
		}
	}

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

async function dump_reservation(room_name, reservation) {
	try {
		console.log('dump reservation file...');
		const date = moment(reservation.date, DATE_FORMAT);
		const date_str = date.format(DUMP_JSON_DATE_FORMAT);
		const from = moment(reservation.from, HOUR_FORMAT);
		const from_str = from.format(DUMP_JSON_HOUR_FORMAT);
		const to = moment(reservation.to, HOUR_FORMAT);
		const to_str = to.format(DUMP_JSON_HOUR_FORMAT);
		const date_folder = date.format(DUMP_FOLDER_DATE_FORMAT);
		const filename = from.format(`${DUMP_FILENAME_HOUR_FORMAT}[.json]`);

		let dir = path.join(DUMP_BASE_FOLDER, room_name, date_folder);

		try {
			await fs.mkdir(dir, { recursive: true });
		} catch (e) {}

		dir = path.join(dir, filename);
		data = {
			room: room_name,
			date: date_str,
			from: from_str,
			to: to_str,
		};
		const data_str = JSON.stringify(data);
		await fs.writeFile(dir, data_str);
		console.log(`successfully write reservation file [${dir}]`);
	} catch (e) {
		throw `can't write reservation file: ${e.toString()}`;
	}
}

async function reserve(room_name, reservation) {
	const room = await roomAPI.find(room_name);
	const { success, message } = await is_valid(reservation);
	if (!success) throw message;
	await create_reservation(room._id, reservation);
	await dump_reservation(room_name, reservation);
}

module.exports = {
	is_valid,
	is_room_available,
	create_reservation,
	get_reservations,
	reserve,
};
