import test from 'tape'
import { stripPreSlash, normalizeRequest } from '../src/utils'

test('stripPreSlash', (assert) => {
    assert.equal(stripPreSlash('/test'), 'test', 'strips string w/slash')
    assert.equal(stripPreSlash('test'), 'test', 'doesn\'t strip string w/o slash')

    assert.end()
})

test('normalizeRequest', (assert) => {
    assert.plan(3)

    const requestString = '/nested/request/query'
    assert.deepEqual(normalizeRequest(requestString), {
        url: 'https://api.patreon.com/oauth2/api/nested/request/query',
        method: 'GET'
    }, 'correctly parses nested request string')

    const requestObject = {
        url: 'url',
        query: 'query'
    }
    assert.deepEqual(normalizeRequest(requestObject), {
        url: 'https://api.patreon.com/oauth2/api/url',
        query: 'query'
    }, 'correctly parses request object with url')

    const requestObjectWithoutUri = {
        key: 'value',
        query: 'query'
    }
    assert.deepEqual(normalizeRequest(requestObjectWithoutUri), {
        url: 'https://api.patreon.com/oauth2/api/',
        key: 'value',
        query: 'query'
    }, 'correctly parses request object without url')
})
