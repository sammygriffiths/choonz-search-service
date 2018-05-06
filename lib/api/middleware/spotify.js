module.exports = {
    generateAccessToken: (dependencies) => async (req, res, next) => {
        const { spotifyApi, cache } = dependencies;
        
        if (typeof spotifyApi === 'undefined' || typeof cache === 'undefined') {
            return next(new Error('Missing dependency'));
        }

        let spotifyAccessToken = cache.get('spotifyAccessToken');

        if (typeof spotifyAccessToken === 'undefined') {
            let spotifyCredentials = await spotifyApi.clientCredentialsGrant();
            spotifyAccessToken = spotifyCredentials['body']['access_token'];

            cache.set('spotifyAccessToken', spotifyAccessToken, spotifyCredentials['body']['expires_in']);
        }

        spotifyApi.setAccessToken(spotifyAccessToken);

        res.locals.spotifyApi = spotifyApi;

        return next();
    }
};
