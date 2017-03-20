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

    client('/current_user')
        .then((res) => {
            assert.ok(res, 'res should be a parsed json object')
            assert.equal(res.user, 'test', 'res.test should equal "test"')
        })
        .catch((err) => {
            throw new Error('promise failed unexpectedly!')
        })
})
