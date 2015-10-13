import test from 'tape'
import nock from 'nock'
import oauth from '../src/oauth'

test('oauth', (assert) => {
    const { getTokens, refreshToken } = oauth('id', 'secret')

    assert.equal(typeof getTokens, 'function', 'should return getTokens function')
    assert.equal(typeof refreshToken, 'function', 'should return refreshToken function')

    assert.end()
})

test('oauth getTokens', (assert) => {
    assert.plan(5)

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .reply(200, function (uri, body) {
            assert.equal(
                body,
                (
                    'client_id=id&client_secret=secret' +
                    '&code=code&grant_type=authorization_code' +
                    '&redirect_uri=%2Fredirect'
                ),
                'params should be sent as form data'
            )

            return { accessToken: 'heyheyhey' }
        })

    const { getTokens } = oauth('id', 'secret')

    getTokens('code', '/redirect', function (err, body) {
        assert.equal(err, null, 'err should be null')
        assert.ok(body.accessToken, 'body should be parsed json object')
    })

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .replyWithError('Oh geeze')

    getTokens('code', '/redirect', function (err, body) {
        assert.notEqual(err, null, 'err should not be null')
        assert.equal(typeof body, 'undefined', 'body should be undefined if err')
    })
})

test('oauth refreshToken', (assert) => {
    assert.plan(5)

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .reply(200, function (uri, body) {
            assert.equal(
                body,
                (
                    'client_id=id&client_secret=secret&' +
                    'refresh_token=token&grant_type=refresh_token'
                ),
                'params should be sent as form data'
            )

            return { pass: true }
        })

    const { refreshToken } = oauth('id', 'secret')

    refreshToken('token', function (err, body) {
        assert.equal(err, null, 'err should be null')
        assert.ok(body.pass, 'body should be parsed json object')
    })

    nock('https://api.patreon.com')
        .post('/oauth2/token')
        .replyWithError('Oh geeze')

    refreshToken('token', function (err, body) {
        assert.notEqual(err, null, 'err should not be null')
        assert.equal(typeof body, 'undefined', 'body should be undefined if err')
    })
})
