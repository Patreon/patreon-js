import fetch from 'isomorphic-fetch'
import VError from 'verror'
import formurlencoded from 'form-urlencoded'
import { checkStatus, getJson } from './utils'

const expectedErrorMap = {
    invalid_grant: (body, req) => {
        return new VError('Invalid grant_type: "%s"', req.params.grant_type)
    },

    invalid_client: (body, req) => {
        return new VError('Invalid client_id: %s', req.params.client_id)
    }
}

function handleError(err) {
    const errFn = typeof expectedErrorMap[err] === 'function'
        ? expectedErrorMap[err]
        : (body) => new VError('Unknown error: %s, %s', err, body)

    return (body, req) => {
        const _err = errFn(body, req)
        _err.params = req.params
        return _err
    }
}

function updateToken(params) {
    const url = 'https://api.patreon.com/oauth2/token'
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
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
                ? Promise.reject(handleError(json.error)(json, options))
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
