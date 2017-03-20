import fetch from 'isomorphic-fetch'
import VError from 'verror'
import formurlencoded from 'form-urlencoded'

const expectedErrorMap = {
    invalid_grant: (body, _req) => {
        return new VError('Invalid grant_type: "%s"', _req.params.grant_type)
    },

    invalid_client: (body, _req) => {
        return new VError('Invalid client_id: %s', _req.params.client_id)
    }
}

function handleError(err) {
    const errFn = typeof expectedErrorMap[err] === 'function'
        ? expectedErrorMap[err]
        : (body) => new VError('Unknown error: %s, %s', err, body)

    return (body, req, res) => {
        const _err = errFn(body, req, res)
        _err.params = req.params
        return _err
    }
}

function updateToken(params) {
    const url = 'https://api.patreon.com/oauth2/token'
    const _req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: formurlencoded(params),
        params: params,
        credentials: 'include',
        compress: false
    }

    let _res
    return fetch(url, _req)
        .then(res => { _res = res; return res.json() })
        .then(json => {
            return (json.error)
                ? Promise.reject(handleError(json.error)(json, _req, _res))
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
