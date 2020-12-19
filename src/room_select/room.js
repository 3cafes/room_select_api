const { Room } = require.main.require('./src/database');

// async function room_reservations_by_day(room_name, date) {
// 	const room = await Room.findOne({ name: room_name });
// 	if (room) {
// 		return (reservations = await Reservation.find({
// 			room: room.id,
// 			date: date,
// 		}));
// 	} else {
// 		return [];
// 	}
// }

async function find(name) {
	return await Room.findOne({ name: name });
}

module.exports = {
	find,
};
