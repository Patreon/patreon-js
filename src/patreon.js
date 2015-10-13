import request from 'request'
import oauth from './oauth'

const BASE_HOST = 'https://api.patreon.com'
const BASE_PATH = '/oauth2/api'

export default function (accessToken, config) {
    return function (_req, callback) {
        const options = normalizeRequest(_req)

        // no callback, return stream
        if (typeof callback !== 'function') return request(options)

        request(options, function (err, resp, body) {
            if (err) return callback(err)
            return callback(null, body)
        })


    }
}

export let ouath = oauth

function normalizeRequest (_req) {
    if (typeof config === 'string') {
        return {
            url: `${BASE_HOST}/${BASE_PATH}/${_req}`,
            method: 'GET'
        }
    }

    return {
        ..._req,
        url: `${BASE_HOST}/${BASE_PATH}` + _req.url || _req.uri
    }
}
