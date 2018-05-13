const expect = require('chai').use(require('chai-as-promised')).expect;
const sinon = require('sinon');
const artist = require('../../../../lib/api/routes/artist');

let req;
let res;
let next;

describe('Artist route', () => {
    beforeEach(() => {
        req = { query: { id: '1234' } };
        res = {
            locals: {
                spotifyApi: {
                    getArtists: sinon.stub().resolves('artist details'),
                    getArtistTopTracks: sinon.stub().resolves('artist top tracks'),
                    getArtistAlbums: sinon.stub().resolves({
                        body: {
                            items: [{
                                id: 'ID1'
                            }, {
                                id: 'ID2'
                            }]
                        }
                    }),
                    getAlbumTracks: sinon.stub().resolves('album tracks')
                }
            },
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    it('gets the artist details based on ID', async () => {
        await artist(req, res, next);

        sinon.assert.calledWith(res.locals.spotifyApi.getArtists, ['1234']);
    });

    it('gets the artist top tracks based on ID', async () => {
        await artist(req, res, next);

        sinon.assert.calledWith(res.locals.spotifyApi.getArtistTopTracks, '1234', 'GB');
    });

    it('gets the artist albums based on ID', async () => {
        await artist(req, res, next);
        
        sinon.assert.calledWith(res.locals.spotifyApi.getArtistAlbums, '1234', {country: 'GB'});
    });
    
    it('gets the albums tracks', async () => {
        await artist(req, res, next);

        sinon.assert.calledWith(res.locals.spotifyApi.getAlbumTracks, 'ID1');
        sinon.assert.calledWith(res.locals.spotifyApi.getAlbumTracks, 'ID2');
    });

    it('returns the data in the correct format', async () => {
        const expectedResult = {
            info: 'artist details',
            topTracks: 'artist top tracks',
            albums: {
                body: {
                    items: [{
                        id: 'ID1',
                        tracks: 'album tracks'
                    }, {
                        id: 'ID2',
                        tracks: 'album tracks'
                    }]
                }
            }
        };
        await artist(req, res, next);

        sinon.assert.calledWith(res.json, expectedResult);
    });
});
