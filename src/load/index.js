const { load_equipments } = require('./load_equipments');
const { load_rooms } = require('./load_rooms');

async function load(equipments, rooms) {
	await load_equipments(equipments);
	await load_rooms(rooms);
}

module.exports = {
	load,
	load_rooms,
	load_equipments,
};
