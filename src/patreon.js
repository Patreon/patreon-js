import fetch from 'isomorphic-fetch'

const BASE_HOST = 'https://api.patreon.com'
const BASE_PATH = 'oauth2/api'

function patreon (accessToken, config) {
    return function (_req, callback) {
        const options = normalizeRequest(_req)

        // no callback, return stream
        if (typeof callback !== 'function') return callApi(options)

        callApi(options, callback)
    }

    function callApi (options, callback) {
        let _res
        fetch(options.url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        })
        .then(res => { _res = res; return res.json() })
        .then(json => { _res.ok ? callback(null, json, _res) : callback(_res.status) })
        .catch(err => callback(err))
    }
}

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

export default patreon
