import fetch from 'isomorphic-fetch'
import formurlencoded from 'form-urlencoded'
import { buildUrl, checkStatus, getJson, userAgentString } from './utils'

function errMap(err, params) {
    if (err === 'invalid_grant') {
        return `Invalid grant_type: ${params.grant_type}`
    } else if (err === 'invalid_client') {
        return `Invalid client_id: ${params.client_id}`
    } else {
        return `Unknown error: ${err}`
    }
}

function updateToken(params) {
    const url = buildUrl('/api/oauth2/token')
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': userAgentString()
        },
        body: formurlencoded(params),
        params: params,
        credentials: 'include',
        compress: false
    }

    return fetch(url, options)
        .then(checkStatus)
        .then(getJson)
        .then(json => {
            return (json.error)
                ? Promise.reject({
                    message: errMap(json.error, params),
                    body: json,
                    params
                })
                : Promise.resolve(json)
        })
        .catch(err => {
            return Promise.reject(err)
        })
}

function oauth(clientId, clientSecret) {
    const baseParams = {
        client_id: clientId,
        client_secret: clientSecret
    }

    return {
        getTokens: (code, redirectUri) => {
            return updateToken({
                ...baseParams,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            })
        },
        refreshToken: (token) => {
            return updateToken({
                ...baseParams,
                refresh_token: token,
                grant_type: 'refresh_token'
            })
        }
    }
}

export default oauth
