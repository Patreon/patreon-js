import test from 'tape'
import nock from 'nock'
import patreon from '../src/patreon'

test('patreon', (assert) => {
    assert.plan(3)

    nock('https://api.patreon.com')
        .get('/oauth2/api/current_user')
        .reply(200, function (uri, body) {
            assert.ok(
                this.req.headers.authorization.indexOf('Bearer token') > -1,
                'Authorization header should be "Bearer token"'
            )

            return { user: 'test' }
        })

    const client = patreon('token')

    client('/current_user', function (err, body) {
        assert.equal(err, null, 'err should be null')
        assert.equal(body.user, 'test', 'body should be a parsed json object')
    })
})
