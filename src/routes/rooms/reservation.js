const router = require('express').Router();
const roomAPI = require.main.require('./src/room_select/room');
const reservationAPI = require.main.require('./src/room_select/reservation');

router.post('/', async (req, res) => {
	const { room, date } = req.body;
	if (!room || !date) {
		res
			.status(400)
			.send({ success: false, reservations: [], message: 'invalid body' });
	}
	try {
		const db_room = await roomAPI.find(room);
		const reservations = await reservationAPI.get_reservations(
			db_room._id,
			date
		);
		return res.status(200).send({
			success: true,
			reservations,
			message: 'reservations successfully retrieved',
		});
	} catch (e) {
		res.status(404).send({
			success: false,
			reservations: [],
			message: e.toString(),
		});
	}
});

router.post('/new', async (req, res) => {
	const { room, date, from, to } = req.body;
	try {
		await reservationAPI.reserve(room, { date, from, to });
		return res.status(200).send({
			success: true,
			message: 'reservation successfully created',
		});
	} catch (e) {
		console.log(e);
		return res.status(400).send({
			success: false,
			message: e.toString(),
		});
	}
});

module.exports = router;
