const expect = require('chai').use(require('chai-as-promised')).expect;
const sinon = require('sinon');
const spotifyHelper = require('../../../../lib/api/helpers/spotify');

let dependencies;

describe('Spotify helper', () => {
    describe('getAccessToken()', () => {
        beforeEach(() => {
            dependencies = {
                spotifyApi: {
                    clientCredentialsGrant: sinon.stub().resolves({
                        body: {
                            access_token: 'newcode',
                            expires_in: 3600
                        }
                    })
                },
                cache: {
                    get: sinon.stub(),
                    set: sinon.stub()
                }
            };
        });

        it('returns a promise with a newly generated access code', async () => {
            let accessCode = await spotifyHelper.getAccessToken(dependencies);

            expect(accessCode).to.equal('newcode');
        });

        it('stores the newly generated code in the cache', async () => {
            let accessCode = await spotifyHelper.getAccessToken(dependencies);

            sinon.assert.calledWith(dependencies.cache.set, 'spotifyAccessToken', 'newcode', 3600);
        });

        it('returns a promise with the access code from the cache (if it exists)', async () => {
            dependencies.cache.get.returns('cachedcode');
            let accessCode = await spotifyHelper.getAccessToken(dependencies);

            expect(accessCode).to.equal('cachedcode');
        });

        it('returns a rejected promise if a dependency is missing', (done) => {
            delete dependencies.spotifyApi;
            let accessCode = spotifyHelper.getAccessToken({ dependencies });

            expect(accessCode).to.eventually.be.rejectedWith('Missing dependency').and.notify(done);
        });
    })
});
