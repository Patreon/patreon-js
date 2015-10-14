import request from 'request'
import oauth from './oauth'

const BASE_HOST = 'https://api.patreon.com'
const BASE_PATH = 'oauth2/api'

function patreon (accessToken, config) {
    return function (_req, callback) {
        const options = normalizeRequest(_req)

        // no callback, return stream
        if (typeof callback !== 'function') return callApi(options)

        callApi(options, callback)

        function callApi (_options, _callback) {
            request({
                ..._options,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }, function (err, resp, body) {
                if (err) return _callback(err)
                return _callback(null, JSON.parse(body))
            })
        }
    }
}

patreon.oauth = oauth

export default patreon

function normalizeRequest (_req) {
    if (typeof _req === 'string') {
        return {
            url: `${BASE_HOST}/${BASE_PATH}/${_stripPreSlash(_req)}`,
            method: 'GET'
        }
    }

    return {
        ..._req,
        url: `${BASE_HOST}/${BASE_PATH}` + _stripPreSlash(_req.url || _req.uri || '')
    }
}

function _stripPreSlash (str) {
    return str.replace(/^\//, '')
}
