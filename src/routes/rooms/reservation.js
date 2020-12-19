const router = require('express').Router();
const reservationAPI = require.main.require('./src/room_select/reservation');

router.post('/new', async (req, res) => {
	const reservation = req.body;
	const check = await reservationAPI.is_valid(reservation);
	if (check.success) {
		return res.status(200).send('ok');
	}
	res.status(500).send(check.message);
});

module.exports = router;
