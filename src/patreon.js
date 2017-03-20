import fetch from 'isomorphic-fetch'

const BASE_HOST = 'https://api.patreon.com'
const BASE_PATH = 'oauth2/api'

function patreon(accessToken, config) {
    return function (_req, callback) {
        const options = normalizeRequest(_req)

        // no callback, return stream
        if (typeof callback !== 'function') return callApi(options)

        callApi(options, callback)
    }

    function callApi(options, callback) {
        let _res
        return fetch(options.url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        })
            .then(res => { _res = res; return res.json() })
            .then(json => {
                return (!_res.ok)
                    ? Promise.reject(_res.status)
                    : Promise.resolve(json)
            })
            .catch(err => {
                return Promise.reject(err)
            })
    }
}

function normalizeRequest(_req) {
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

function _stripPreSlash(str) {
    return str.replace(/^\//, '')
}

export default patreon
