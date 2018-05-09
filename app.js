const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const spotifyMiddleware = require('./lib/api/middleware/spotify');
const api = require('./lib/api');
const NodeCache = require('node-cache');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const cache = new NodeCache();
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(spotifyMiddleware.generateAccessToken({ spotifyApi, cache }));

app.use('/', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.statusCode || 500);
  res.json({ error: err.message });
});

module.exports = app;
