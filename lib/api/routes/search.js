module.exports = async (req, res, next) => {
    let results = await res.locals.spotifyApi.searchTracks('blink-182');
    console.log(results.body.tracks.items);
    res.json([]);
};
