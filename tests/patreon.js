import test from 'tape'
import nock from 'nock'
import patreon from '../src/patreon'

test('patreon', (assert) => {
    assert.plan(8)

    nock('https://www.patreon.com/api')
        .get('/oauth2/api/current_user')
        .reply(200, function (uri, body) {
            assert.ok(
                this.req.headers.authorization.indexOf('Bearer token') > -1,
                'Authorization header should be "Bearer token"'
            )

            return {
                data: {
                    type: 'user',
                    id: '123',
                    attributes: {
                        full_name: 'Test User'
                    },
                    relationships: {
                        campaign: {
                            data: {
                                type: 'campaign',
                                id: '456'
                            }
                        }
                    }
                },
                included: [{
                    type: 'campaign',
                    id: '456',
                    attributes: {
                        'pledge_sum': 123456
                    }
                }]
            }
        })

    const client = patreon('token')

    client('/current_user')
        .then(({ store, rawJson }) => {
            assert.equal(store.find('user', '123').full_name, 'Test User', 'store should be a JSON:API data store')
            assert.equal(store.find('user', '123').campaign.pledge_sum, 123456, 'store should be a JSON:API data store')

            assert.ok(rawJson, 'rawJson should be a parsed rawJson object')
            assert.equal(rawJson.data.attributes.full_name, 'Test User', 'rawJson should have the correct content')

            const _store = client.getStore()
            console.log('_st', JSON.stringify(_store.findAll('user').map(user => user.serialize())))
            assert.equal(_store.find('user', '123').full_name, 'Test User', 'store should be a JSON:API data store')
            assert.equal(_store.find('user', '123').campaign.pledge_sum, 123456, 'store should be a JSON:API data store')
        })
        .catch((err) => {
            assert.fail(err, 'promise failed unexpectedly!')
        })

    nock('https://www.patreon.com/api')
        .get('/oauth2/api/current_user')
        .replyWithError('Oh geeze')

    client('/current_user')
        .then((result) => {
            assert.fail('promise passed unexpectedly!')
        })
        .catch((err) => {
            assert.notEqual(err, null, 'err should not be null')
        })
})
