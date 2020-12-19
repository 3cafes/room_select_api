const { Equipment } = require.main.require('./src/database');

function validate_equipment(equipment) {
	return equipment && equipment != '';
}

function format_equipment(equipment) {
	return {
		name: equipment,
	};
}

async function new_equipment(equipment) {
	console.log(`storing new equipment [${equipment}] in database...`);
	const formated_equipment = format_equipment(equipment);
	const new_equipment = new Equipment(formated_equipment);
	try {
		const saved = await new_equipment.save();
		equipment_id_map[save.name] = saved._id;
	} catch (e) {
		console.error(`can't save ${equipment.name}: ${e.toString()}`);
	}
}

async function load_equipments(equipments) {
	console.log('loading equipments...');
	if (!Array.isArray(equipments)) {
		throw 'invalid equipments field in rooms file [data/equipments.json]';
	}

	const db_equipments = await Equipment.find();
	for (let idx = 0; idx < equipments.length; idx++) {
		console.log(`verifying equipment ${idx}`);

		if (!validate_equipment(equipments[idx])) {
			console.error(`equipment ${idx}: invalid format`);
			continue;
		}
		const db_equipment = db_equipments.find(
			(obj) => obj.name == equipments[idx]
		);
		if (!db_equipment) {
			new_equipment(equipments[idx]);
		}
	}
}

module.exports = {
	load_equipments,
};
