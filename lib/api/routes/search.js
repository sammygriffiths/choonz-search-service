const spotifyRegion = process.env.SPOTIFY_REGION || 'GB';

module.exports = (req, res, next) => {
    let searchTerm = req.query.term;
    let types = ['album', 'artist', 'track'];

    return res.locals.spotifyApi.search(searchTerm, types, { 'market': spotifyRegion })
        .then(res.json.bind(res))
        .catch(next);
};
