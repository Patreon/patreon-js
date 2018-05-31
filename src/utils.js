import { version } from '../package.json'
const os = require('os')

const BASE_HOST = process.env.PATREON_OAUTH_HOST || 'https://www.patreon.com'
const BASE_PATH = 'api/oauth2/v2'

function buildUrl(path) {
    return BASE_HOST + path
}

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
    return response.json()
}

function userAgentString() {
    return `Patreon-JS, version ${version}, platform ${os.platform()}-${os.release()}-${os.arch()}`
}

export { stripPreSlash, normalizeRequest, checkStatus, getJson, userAgentString, buildUrl }
