module.exports = {
    getAccessToken: (dependencies) => {
        const { spotifyApi, cache } = dependencies;
        
        return new Promise(async (resolve, reject) => {
            if (typeof spotifyApi === 'undefined' || typeof cache === 'undefined') {
                return reject(new Error('Missing dependency'));
            }

            let spotifyAccessToken = cache.get('spotifyAccessToken');
    
            if (typeof spotifyAccessToken === 'undefined') {
                let spotifyCredentials = await spotifyApi.clientCredentialsGrant();
                spotifyAccessToken = spotifyCredentials['body']['access_token'];

                cache.set('spotifyAccessToken', spotifyAccessToken, spotifyCredentials['body']['expires_in']);
            }

            return resolve(spotifyAccessToken);
        });
    }
};
