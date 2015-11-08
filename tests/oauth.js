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
 * GET TOKENS
 */
test('oauth getTokens', (assert) => {
    assert.plan(5)

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

    const { getTokens } = oauth('id', 'secret')

    getTokens('code', '/redirect', function (err, body) {
        assert.equal(err, null, 'err should be null')
        assert.ok(body.access_token, 'body should be parsed json object')
    })

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .replyWithError('Oh geeze')

    getTokens('code', '/redirect', function (err, body) {
        assert.notEqual(err, null, 'err should not be null')
        assert.equal(typeof body, 'undefined', 'body should be undefined if err')
    })
})

/**
 * REFRESH TOKENS
 */
test('oauth refreshToken', (assert) => {
    assert.plan(5)

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

    refreshToken('token', function (err, body) {
        assert.equal(err, null, 'err should be null')
        assert.ok(body.refresh_token, 'body should be parsed json object')
    })

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .replyWithError('Oh geeze')

    refreshToken('token', function (err, body) {
        assert.notEqual(err, null, 'err should not be null')
        assert.equal(typeof body, 'undefined', 'body should be undefined if err')
    })
})
