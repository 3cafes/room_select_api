const { Room } = require.main.require('./src/database');
const { Equipment } = require.main.require('./src/database');
const EquipmentAPI = require('./equipment');

async function find_with(capacity, equipment_name_list) {
	try {
		if (equipment_name_list.length > 0) {
			const db_equipments = await EquipmentAPI.equipments_in_name_list(
				equipment_name_list
			);
			const equipment_ids = db_equipments.map((obj) => obj._id);
			return await Room.find({
				capacity: { $gte: capacity },
				equipments: { $all: equipment_ids },
			});
		} else {
			return await Room.find({
				capacity: { $gte: capacity },
			});
		}
	} catch (e) {
		throw `can't retrieve rooms ${e.toString()}`;
	}
}

async function find(name) {
	const room = await Room.findOne({ name: name });
	if (!room) {
		throw 'invalid room';
	}
	return room;
}

async function equipment_name_list(room) {
	try {
		const equipments = await Equipment.find();
		let list = [];
		room.equipments.forEach((id) => {
			const equipment = equipments.find(
				(obj) => obj._id.toString() === id.toString()
			);
			list.push(equipment.name);
		});
		return list;
	} catch (e) {
		throw `can't retrieve room's equipments ${e.toString()}`;
	}
}

module.exports = {
	find,
	find_with,
	equipment_name_list,
};
