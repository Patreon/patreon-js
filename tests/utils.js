import test from 'tape'
import { stripPreSlash, normalizeRequest, checkStatus } from '../src/utils'

test('stripPreSlash', (assert) => {
    assert.equal(stripPreSlash('/test'), 'test', 'strips string w/slash')
    assert.equal(stripPreSlash('test'), 'test', 'doesn\'t strip string w/o slash')

    assert.end()
})

test('normalizeRequest', (assert) => {
    assert.plan(3)

    const requestString = '/nested/request/query'
    assert.deepEqual(normalizeRequest(requestString), {
        url: 'https://www.patreon.com/api/oauth2/api/nested/request/query',
        method: 'GET'
    }, 'correctly parses nested request string')

    const requestObject = {
        url: 'url',
        query: 'query'
    }
    assert.deepEqual(normalizeRequest(requestObject), {
        url: 'https://www.patreon.com/api/oauth2/api/url',
        query: 'query'
    }, 'correctly parses request object with url')

    const requestObjectWithoutUri = {
        key: 'value',
        query: 'query'
    }
    assert.deepEqual(normalizeRequest(requestObjectWithoutUri), {
        url: 'https://www.patreon.com/api/oauth2/api/',
        key: 'value',
        query: 'query'
    }, 'correctly parses request object without url')
})

test('checkStatus', (assert) => {
    assert.plan(2)

    const goodResponse = {
        status: 200,
        key: 'value'
    }
    checkStatus(goodResponse)
        .then((res) => {
            assert.deepEqual(res, {
                status: 200,
                key: 'value'
            }, 'properly formatted json should resolve the json')
        })
        .catch((err) => {
            assert.fail('promise failed unexpectedly!')
        })

    const badResponse = {
        status: 300,
        key: 'value'
    }
    checkStatus(badResponse)
        .then((res) => {
            assert.fail('promise passed unexpectedly!')
        })
        .catch((err) => {
            assert.deepEqual(err, {
                status: 300,
                key: 'value'
            }, 'improperly formatted response should reject the json')
        })
})
