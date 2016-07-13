import isPlainObject from 'is-plain-object'

const _encode = value => Array.isArray(value) && !value.length ? '[]' : encodeURI(value)

const encodeParam = (value, key) => {
    if (isPlainObject(value)) {
        return Object.keys(value).reduce((memo, _key) => {
            return `${memo}${key}[${_key}]=${_encode(value[_key])}&`
        }, '')
    } else {
        return `${key}=${_encode(value)}&`
    }
}

const encodeParams = (params) => {
    if (!params) return ''
    return Object.keys(params).reduce((memo, key) =>
        `${memo}${encodeParam(params[key], key)}`
    , '')
}

export default function(url, _params) {
    const separator = url.includes('?') ? '&' : '?'

    const params = _params
        ? encodeParams(_params)
        : ''

    return `${url}${separator}${params}`
}
