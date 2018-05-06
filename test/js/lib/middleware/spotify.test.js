const expect = require('chai').use(require('chai-as-promised')).expect;
const sinon = require('sinon');
const spotifyMiddleware = require('../../../../lib/api/middleware/spotify');

let dependencies;
let res;

describe('Spotify helper', () => {
    describe('generateAccessToken()', () => {
        beforeEach(() => {
            dependencies = {
                spotifyApi: {
                    clientCredentialsGrant: sinon.stub().resolves({
                        body: {
                            access_token: 'newcode',
                            expires_in: 3600
                        }
                    }),
                    setAccessToken: sinon.stub()
                },
                cache: {
                    get: sinon.stub(),
                    set: sinon.stub()
                }
            };

            res = { locals: {} };
        });

        it('sets access token to a newly generated access code', async () => {
            await spotifyMiddleware.generateAccessToken(dependencies)({}, res, sinon.stub());

            sinon.assert.calledWith(dependencies.spotifyApi.setAccessToken, 'newcode');
        });

        it('stores the newly generated code in the cache', async () => {
            await spotifyMiddleware.generateAccessToken(dependencies)({}, res, sinon.stub());

            sinon.assert.calledWith(dependencies.cache.set, 'spotifyAccessToken', 'newcode', 3600);
        });

        it('sets access token to the access code from the cache (if it exists)', async () => {
            dependencies.cache.get.returns('cachedcode');
            await spotifyMiddleware.generateAccessToken(dependencies)({}, res, sinon.stub());

            sinon.assert.calledWith(dependencies.spotifyApi.setAccessToken, 'cachedcode');
        });

        it('puts the spotifyApi in res.locals', async () => {
            let expectedRes = {locals: {spotifyApi: dependencies.spotifyApi}};
            await spotifyMiddleware.generateAccessToken(dependencies)({}, res, sinon.stub());
            
            expect(res).to.deep.equal(expectedRes);
        });

        it('calls next with no error if there is no problem', async () => {
            const next = sinon.spy();
            await spotifyMiddleware.generateAccessToken(dependencies)({}, res, next);

            sinon.assert.calledOnce(next);
            sinon.assert.neverCalledWith(next, sinon.match.instanceOf(Error));
        });

        it('calls next with an error if a dependency is missing', async () => {
            const next = sinon.spy();
            delete dependencies.spotifyApi;
            await spotifyMiddleware.generateAccessToken(dependencies)({}, res, next);

            sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
        });
    })
});
