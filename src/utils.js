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
    return Promise.reject()
}

function getJson(response) {
    return Promise.reject()
}

export { stripPreSlash, normalizeRequest, checkStatus, getJson }
