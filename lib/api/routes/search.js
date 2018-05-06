const spotifyRegion = process.env.SPOTIFY_REGION || 'GB';

module.exports = async (req, res, next) => {
    let searchTerm = req.query.term;
    let results;

    try {
        results = await res.locals.spotifyApi.search(
            searchTerm,
            ['album', 'artist', 'track'],
            { 'market': spotifyRegion }
        );
    } catch (error) {
        return next(error);
    }

    return res.json(results);
};
