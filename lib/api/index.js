const router = require('express').Router();
const search = require('./routes/search');

router.get('/search', search);

module.exports = router;
