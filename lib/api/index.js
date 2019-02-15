const router = require('express').Router();
const search = require('./routes/search');
const artist = require('./routes/artist');

router.get('/search', search);
router.get('/artist', artist);

module.exports = router;
