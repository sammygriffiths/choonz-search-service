const router = require('express').Router();
const search = require('./routes/search');

module.exports = (spotifyAccessToken) => {
    router.get('/search', search(spotifyAccessToken));

    return router;
};
