const expect = require('chai').use(require('chai-as-promised')).expect;
const sinon = require('sinon');
const search = require('../../../../lib/api/routes/search');

let req;
let res;
let next;

describe('Search route', () => {
    beforeEach(() => {
        req = { query: { term: 'search term' } };
        res = {
            locals: {
                spotifyApi: {
                    search: sinon.stub().resolves('results go here')
                }
            },
            json: sinon.stub()
        };
        next = sinon.spy();
    });

    it('searches spotify\'s API for the requested search term', async () => {
        await search(req, res, next);

        sinon.assert.calledWith(res.locals.spotifyApi.search, 'search term', ['album', 'artist', 'track'], {'market': 'GB'});
    });
    
    it('outputs the search results as json', async () => {
        await search(req, res, next);
        
        sinon.assert.calledWith(res.json, 'results go here');
    });

    it('calls next with an error if there is a problem', async () => {
        let error = new Error('this is an error');
        res.locals.spotifyApi.search = sinon.stub().rejects(error);

        await search(req, res, next);
        sinon.assert.calledOnce(next);
    });
});
