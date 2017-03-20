import test from 'tape'
import nock from 'nock'
import oauth from '../src/oauth'

const mockTokenPayload = JSON.stringify({
    access_token: 'access',
    refresh_token: 'refresh',
    expires_in: 'expires',
    scope: 'users pledges-to-me my-campaign',
    token_type: 'Bearer'
})

/**
 * INIT
 */
test('oauth', (assert) => {
    const { getTokens, refreshToken } = oauth('id', 'secret')

    assert.equal(typeof getTokens, 'function', 'should return getTokens function')
    assert.equal(typeof refreshToken, 'function', 'should return refreshToken function')

    assert.end()
})

/**
 * GET TOKENS promisified
 */
test('oauth getTokens', (assert) => {
    assert.plan(3)

    const { getTokens } = oauth('id', 'secret')

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .reply(200, function (uri, body) {
            const params = (
                'client_id=id&client_secret=secret' +
                '&code=code&grant_type=authorization_code' +
                '&redirect_uri=%2Fredirect'
            )

            assert.equal(body, params, 'params should be sent as form data')

            return mockTokenPayload
        })

    getTokens('code', '/redirect')
        .then((res) => {
            assert.ok(res, 'res should be parsed json object')
        })
        .catch((err) => {
            throw new Error('promise failed unexpectedly!')
        })

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .replyWithError('Oh geeze')

    getTokens('code', '/redirect')
        .then((res) => {
            throw new Error('promise passed unexpectedly!')
        })
        .catch((err) => {
            assert.notEqual(err, null, 'err should not be null')
        })
})

/**
 * REFRESH TOKENS promisified
 */
test('oauth refreshToken', (assert) => {
    assert.plan(3)

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .reply(200, function (uri, body) {
            const params = (
                'client_id=id&client_secret=secret&' +
                'refresh_token=token&grant_type=refresh_token'
            )

            assert.equal(body, params, 'params should be sent as form data')

            return mockTokenPayload
        })

    const { refreshToken } = oauth('id', 'secret')

    refreshToken('token')
        .then((res) => {
            assert.ok(res, 'body should be parsed json object')
        })
        .catch((err) => {
            throw new Error('promise failed unexpectedly!')
        })

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .replyWithError('Oh geeze')

    refreshToken('token')
        .then((res) => {
            throw new Error('promise passed unexpectedly!')
        })
        .catch((err) => {
            assert.notEqual(err, null, 'err should not be null')
        })
})
