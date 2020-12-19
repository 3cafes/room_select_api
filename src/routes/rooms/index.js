const router = require('express').Router();

router.use('/search', require('./search'));
router.use('/reservation', require('./reservation'));

module.exports = router;
