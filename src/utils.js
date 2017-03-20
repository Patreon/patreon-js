const BASE_HOST = 'https://api.patreon.com'
const BASE_PATH = 'oauth2/api'

function stripPreSlash(str) {
    return str.replace(/^\//, '')
}

function normalizeRequest(request) {
    return (typeof request === 'string')
        ? {
            url: `${BASE_HOST}/${BASE_PATH}/${stripPreSlash(request)}`,
            method: 'GET'
        }
        : {
            ...request,
            url: `${BASE_HOST}/${BASE_PATH}/${stripPreSlash(request.url || request.uri || '')}`
        }
}

function checkStatus(response) {
    return (response.status >= 200 && response.status < 300)
        ? Promise.resolve(response)
        : Promise.reject(response)
}

function getJson(response) {
    try {
        return response.json()
    } catch (err) {
        return response
    }
}

export { stripPreSlash, normalizeRequest, checkStatus, getJson }
