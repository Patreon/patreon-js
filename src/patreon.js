import fetch from 'isomorphic-fetch'
import { normalizeRequest, checkStatus, getJson } from './utils'

function patreon(accessToken) {
    return function(request) {
        const normalizedRequest = normalizeRequest(request)
        const url = normalizedRequest.url
        const options = {
            ...normalizedRequest,
            headers: { Authorization: `Bearer ${accessToken}` },
            credentials: 'include'
        }

        return fetch(url, options).then(checkStatus).then(getJson).catch(err => {
            return Promise.reject(err)
        })
    }
}

export default patreon
