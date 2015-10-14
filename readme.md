# patreon-js

[![Build State](https://img.shields.io/travis/Patreon/patreon-js.svg?style=flat)](https://travis-ci.org/Patreon/patreon-js)

Use the Patreon API via OAuth.

## Installation

```js
npm install --save patreon
```

## Usage

```js
var patreon = require('patreon');

patreon.oauth(function (err, tokens) {
    client = patreon(tokens.accessToken)

    // callback
    client(`/current_user`, function (err, body) {
        if (err) return console.error(body)
    })

    // stream
    const res = client(`/current_user`)
    res.on('error', console.error)
    res.on('data', console.log)
})
```

```js
const patreon, { oauth } from 'patreon'

const { getToken } = oauth(id, secret)
getToken(code, '/something', (err, { accessToken }) => {
    const client = patreon(accessToken)

    // callback
    client(`/current_user`, (err, body) => {
        if (err) return console.error(body)
    })

    // stream
    const res = client(`/current_user`)
    res.on('error', console.error)
    res.on('data', console.log)
});
```
