const router = require('express').Router();

const RoomAPI = require.main.require('./src/room_select/room');
const EquipmentAPI = require.main.require('./src/room_select/equipment');
const ReservationAPI = require.main.require('./src/room_select/reservation');

router.post('/available', async (req, res) => {
	const { date, from, to, capacity, equipments } = req.body;
	const reservation = { date, from, to };
	if (
		!capacity ||
		!(await ReservationAPI.is_valid(reservation)).success ||
		!(await EquipmentAPI.equipment_list_is_valid(equipments))
	) {
		return res.status(400).send({
			success: false,
			rooms: [],
			message: 'invalid request',
		});
	}
	try {
		const rooms = await RoomAPI.find_with(capacity, equipments);
		let available_rooms = [];
		rooms.sort((a, b) => a.capacity - b.capacity);
		for (let i = 0; i < rooms.length; i++) {
			const room = rooms[i];
			if (await ReservationAPI.is_room_available(rooms[i]._id, reservation)) {
				const equipments_names = await RoomAPI.equipment_name_list(room);
				available_rooms.push({
					name: room.name,
					capacity: room.capacity,
					description: room.description,
					equipments: equipments_names,
				});
			}
		}
		//format rooms
		return res.status(200).send({
			success: true,
			rooms: available_rooms,
			message: 'success',
		});
	} catch (e) {
		return res.status(400).send({
			success: false,
			rooms: [],
			message: e.toString(),
		});
	}
});

module.exports = router;
