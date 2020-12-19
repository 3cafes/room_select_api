const router = require('express').Router();

router.use('/rooms', require('./rooms'));

module.exports = router;
