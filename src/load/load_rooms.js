const { Equipment } = require('../database');

const { Room } = require.main.require('./src/database');

async function build_equipement_id_map() {
	const db_equipments = await Equipment.find();
	let id_map = {};
	for (let idx = 0; idx < db_equipments.length; idx++) {
		id_map[db_equipments[idx].name] = db_equipments[idx]._id.toString();
	}
	return id_map;
}

function validate_equipments(equipments, equipment_id_map) {
	let valid = true;
	equipments.forEach((equipment) => {
		if (!equipment_id_map[equipment.name]) {
			valid = false;
		}
	});
	return valid;
}

function validate_room(room, equipment_id_map) {
	const { name, capacity, equipments } = room;

	return (
		name &&
		name != '' &&
		capacity &&
		capacity > 0 &&
		Array.isArray(equipments) &&
		validate_equipments(equipments, equipment_id_map)
	);
}

function format_room(room, equipment_id_map) {
	return {
		name: room.name,
		description: room.description,
		capacity: room.capacity,
		equipments: room.equipments.map(
			(equipment) => equipment_id_map[equipment.name]
		),
	};
}

async function new_room(room) {
	console.log(`storing new room [${room.name}] in database...`);
	const new_room = new Room(room);
	try {
		await new_room.save();
	} catch (e) {
		console.error(`can't save ${room.name}: ${e.toString()}`);
	}
}

function same_equipments(a, b) {
	if (a.length != b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] != b[i]) return false;
	}
	return true;
}

async function update_room(db_room, room) {
	if (
		room.description != db_room.description ||
		room.capacity != db_room.capacity ||
		!same_equipments(db_room.equipments, room.equipments)
	) {
		console.log(`updating room [${room.name}]...`);
		try {
			await Room.updateOne(
				{ _id: db_room.id },
				{
					description: room.description,
					capacity: room.capacity,
					equipments: room.equipments,
				}
			);
		} catch (e) {
			console.error(`can't update ${room.name}: ${e.toString()}`);
		}
	}
}

async function load_rooms(rooms) {
	console.log('loading rooms...');
	if (!Array.isArray(rooms) || rooms.length < 1) {
		throw 'invalid room file [data/rooms.json]';
	}
	const db_rooms = await Room.find();
	const equipment_id_map = await build_equipement_id_map();

	for (let idx = 0; idx < rooms.length; idx++) {
		console.log(`verifying room ${idx}`);

		if (!validate_room(rooms[idx], equipment_id_map)) {
			console.error(`room ${idx}: invalid format`);
			continue;
		}
		const db_room = db_rooms.find((elem) => elem.name == rooms[idx].name);
		const formated_room = format_room(rooms[idx], equipment_id_map);
		if (db_room) {
			await update_room(db_room, formated_room);
		} else {
			await new_room(formated_room);
		}
	}
}

module.exports = {
	load_rooms,
};
