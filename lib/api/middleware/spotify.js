module.exports = {
    generateAccessToken: (dependencies) => async (req, res, next) => {
        const { spotifyApi, cache } = dependencies;
        
        if (typeof spotifyApi === 'undefined' || typeof cache === 'undefined') {
            return next(new Error('Missing dependency'));
        }

        let spotifyAccessToken = cache.get('spotifyAccessToken');

        if (typeof spotifyAccessToken === 'undefined') {
            await spotifyApi.clientCredentialsGrant()
                .then((credentials) => {
                    spotifyAccessToken = credentials['body']['access_token'];

                    cache.set('spotifyAccessToken', spotifyAccessToken, credentials['body']['expires_in']);
                })
                .catch(next);
        }

        spotifyApi.setAccessToken(spotifyAccessToken);

        res.locals.spotifyApi = spotifyApi;

        return next();
    }
};
