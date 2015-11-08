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

export default function (clientId, clientSecret) {
    const baseParams = {
        client_id: clientId,
        client_secret: clientSecret
    }

    function get (code, redirectUri, callback) {
        return updateToken({
            ...baseParams,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
        }, callback)
    }

    function refresh (token, callback) {
        return updateToken({
            ...baseParams,
            refresh_token: token,
            grant_type: 'refresh_token'
        }, callback)
    }

    function updateToken (params, callback) {
        const url = `https://api.patreon.com/oauth2/token`
        const _req = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: formurlencoded.encode(params),
            params: params,
            credentials: 'include',
            compress: false
        }

        let _res
        fetch(url, _req)
            .then(res => { _res = res; return res.json() })
            .then(json => {
                if (json.error) callback(handleError(json.error)(json, _req, _res))

                callback(null, json, _res)
            })
            .catch(err => callback(err))
    }

    return {
        getTokens: get,
        refreshToken: refresh
    }
}
