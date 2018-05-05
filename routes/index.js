const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const NodeCache = require("node-cache");
const myCache = new NodeCache();

/* GET home page. */
router.get('/', async (req, res, next) => {
  let clientId = 'be12b8fd2f524e7e90774c64c7549ef1';
  let clientSecret = 'ed3ac7c7139b4ab58599f839b6df5ec3';

  // Create the api object with the credentials
  let spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
  });

  // Retrieve an access token.
  let spotifyAccessToken = myCache.get('spotifyAccessToken');
  if (typeof spotifyAccessToken === 'undefined') {
    let spotifyCredentials = await spotifyApi.clientCredentialsGrant();
    spotifyAccessToken = spotifyCredentials['body']['access_token'];
    // myCache.set('spotifyAccessToken', spotifyAccessToken, spotifyCredentials['body']['expires_in']);
    myCache.set('spotifyAccessToken', spotifyAccessToken, 60);
    console.log(typeof spotifyCredentials['body']['expires_in'], spotifyCredentials['body']['expires_in']);
  }

  console.log(spotifyAccessToken);
  res.json([]);
});

module.exports = router;
