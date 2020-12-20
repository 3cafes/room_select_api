const { Equipment } = require.main.require('./src/database');

async function equipments_in_name_list(name_list) {
	try {
		const equipments = await Equipment.find({ name: { $in: name_list } });
		return equipments;
	} catch (e) {
		throw `can't retrieve equipment list ${e.toString()}`;
	}
}

async function equipment_name_list() {
	try {
		const equipments = await Equipment.find();
		return equipments.map((equipment) => equipment.name);
	} catch (e) {
		throw `can't retrieve equipment list ${e.toString()}`;
	}
}

async function equipment_id_list() {
	try {
		const equipments = await Equipment.find();
		return equipments.map((equipment) => equipment._id);
	} catch (e) {
		throw `can't retrieve equipment list ${e.toString()}`;
	}
}

async function equipment_list_is_valid(list) {
	if (!list || !Array.isArray(list)) return false;
	if (list.length == 0) return true;
	try {
		const db_equipments = await equipment_name_list();
		for (let i = 0; i < list.length; i++) {
			if (!db_equipments.includes(list[i])) {
				return false;
			}
		}
	} catch (e) {
		return false;
	}
	return true;
}

module.exports = {
	equipments_in_name_list,
	equipment_name_list,
	equipment_id_list,
	equipment_list_is_valid,
};
