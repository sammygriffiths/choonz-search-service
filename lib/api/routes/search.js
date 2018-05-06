module.exports = (spotifyAccessToken) => (req, res, next) => {
    console.log(req.query);
    res.json([]);
};
