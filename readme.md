# patreon-js

[![Build State](https://img.shields.io/circleci/project/Patreon/patreon-js.svg?style=flat)](https://circleci.com/gh/Patreon/patreon-js)

Use the Patreon API via OAuth.

## Setup

You'll need to register an OAuth client account to receive a `client_id`, `client_secret` and other info for use with this module.

Visit the [OAuth Documentation Page](https://www.patreon.com/oauth2/documentation) **while logged in as a Patreon creator on patreon.com** to register your client.

## Installation

Install with [npm](https://www.npmjs.com). You'll need to have [Node.js](https://nodejs.org) installed.

```js
npm install --save patreon
```


## Usage

When you see `'pppp'` replace `pppp` with the data you received setting up
your OAuth account or otherwise suggested by the inline comments.

```js
var patreon = require('patreon')

// Use the client id and secret you received when setting up your OAuth account
var CLIENT_ID = 'pppp'
var CLIENT_SECRET = 'pppp'

var getTokens = patreon.oauth(CLIENT_ID, CLIENT_SECRET).getTokens

// This is provided as a query param (?code=pppp) after authenticating on patreon.com
var code = 'pppp'
// This should be one of the fully qualified redirect_uri you used when setting up your oauth account
var redirect = 'http://mypatreonapp.com/oauth/redirect'

getTokens(code, redirect, function (err, tokens) {
    client = patreon(tokens.access_token)

    client(`/current_user`, function (err, user) {
        if (err) return console.error(err)

        console.log(user)
    })
})
```

If you're using [babel](https://babeljs.io) or writing [es2015](https://babeljs.io/docs/learn-es2015/) code:

```js
const patreon, { oauth } from 'patreon'

const CLIENT_ID = 'pppp'
const CLIENT_SECRET = 'pppp'

const code = 'pppp'
const redirect = 'http://mypatreonapp.com/oauth/redirect'

const { getTokens } = oauth(CLIENT_ID, CLIENT_SECRET)
getTokens(code, redirect, (err, { access_token }) => {
    const client = patreon(access_token)

    client(`/current_user`, (err, body) => {
        if (err) return console.error(err)

        console.log(body)
    })
});
```

You can also reference the included [server example](/examples/server.js).

## Methods

### var pTokens = oauth(clientId, clientSecret)

Returns an object containing functions for fetching OAuth access tokens.

`clientId` The client id you received after setting up your OAuth account.  
`clientSecret` The client secret you received after setting up your OAuth account.

### pTokens.getTokens(redirectCode, redirectUri, callback(err, tokens, res))

This makes a request to grab tokens needed for making API requests.

`redirectCode` Use the `code` query param provided to your OAauth redirect route.  
`redirectUri` This should be the same redirect route you provided in the initial auth request.  
`callback` Called with an `err` if there is one, a `tokens` object and the response object `res` for any inspection.

The `tokens` object will look something like this:

```js
{
    access_token: 'pppp',
    refresh_token: 'pppp',
    expires_in: 'pppp',
    scope: 'users pledges-to-me my-campaign',
    token_type: 'Bearer'
}
```

You must pass `tokens.access_token` in to `patreon` for making API calls.

### var client = patreon(accessToken)

Returns a function for making authenticated API calls.

### client(pathname, callback(err, body))

`pathane` API resource path like `/current_user`.  
`callback` Called with an `err` if there is one, `body` is the [json:api](http://jsonapi.org)
response for the resource.

## API Resources

`/current_user`  
`/current_user/campaigns`
