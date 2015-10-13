import request from 'request'

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
        const _req = {
            url: `https://api.patreon.com/oauth2/token`,
            method: 'POST',
            form: params
        }

        if (typeof callback !== 'function') return request(_req)

        request(_req, function (err, resp, body) {
            if (err) return callback(err)

            return callback(null, JSON.parse(body))
        })
    }

    return {
        getTokens: get,
        refreshToken: refresh
    }
}
