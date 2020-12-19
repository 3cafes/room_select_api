const router = require('express').Router();

router.get('/available', (req, res) => {
	res.send('available !');
});

module.exports = router;
