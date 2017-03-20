import fetch from 'isomorphic-fetch'
import { normalizeRequest } from '../src/utils'

function patreon(accessToken, config) {
    return function (_req) {
        const options = normalizeRequest(_req)
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

export default patreon
