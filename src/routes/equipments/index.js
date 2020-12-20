const router = require('express').Router();
const { equipment_name_list } = require.main.require(
	'./src/room_select/equipment'
);

router.get('/all', async (req, res) => {
	try {
		const list = await equipment_name_list();
		res.status(200).send({
			success: true,
			equipments: list,
			message: 'success',
		});
	} catch (e) {
		res.status(400).send({
			success: false,
			equipments: [],
			message: e.toString(),
		});
	}
});

module.exports = router;
