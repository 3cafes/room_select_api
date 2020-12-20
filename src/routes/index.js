const router = require('express').Router();

router.use('/room', require('./rooms'));
router.use('/equipment', require('./equipments'));

module.exports = router;
