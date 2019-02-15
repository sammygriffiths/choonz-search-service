const spotifyRegion = process.env.SPOTIFY_REGION || 'GB';

module.exports = (req, res, next) => {
    let artistId = req.query.id;

    return Promise.all([
        res.locals.spotifyApi.getArtists([artistId]),
        res.locals.spotifyApi.getArtistTopTracks(artistId, spotifyRegion),
        res.locals.spotifyApi.getArtistAlbums(artistId, { country: spotifyRegion })
        .then(albums => {
            let albumPromises = albums.body.items.map(album => 
                Promise.all([album, res.locals.spotifyApi.getAlbumTracks(album.id)])
            );
            return Promise.all([albums, Promise.all(albumPromises)]);
        })
    ])
    .then(data => {
        let result = {
            info: data[0],
            topTracks: data[1],
            albums: data[2][0]
        };
        result.albums.body.items = data[2][1];
        result.albums.body.items = result.albums.body.items.map(album => {
            album[0].tracks = album[1];
            return album[0];
        })

        res.json(result);
    })
    .catch(next);
};
