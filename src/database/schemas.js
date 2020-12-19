const mongoose = require('mongoose');

const EquipmentSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
});

const RoomSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, default: 'a room' },
	capacity: { type: Number, required: true },
	equipments: { type: [mongoose.Schema.Types.ObjectId], default: [] },
});

const ReservationSchema = mongoose.Schema({
	room: { type: mongoose.Schema.Types.ObjectId, required: true },
	from: { type: mongoose.Schema.Types.Date, required: true },
	to: { type: mongoose.Schema.Types.Date, required: true },
});

const Equipment = mongoose.model('Equipment', EquipmentSchema);
const Room = mongoose.model('Room', RoomSchema);
const Reservation = mongoose.model('Reservation', RoomSchema);

module.exports = {
	Room,
	Equipment,
	Reservation,
};
