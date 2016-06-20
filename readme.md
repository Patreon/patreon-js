# patreon-js

[![Build State](https://img.shields.io/circleci/project/Patreon/patreon-js.svg?style=flat)](https://circleci.com/gh/Patreon/patreon-js)

Use the Patreon API via OAuth.


## Setup

You'll need to register an OAuth client account to receive a `client_id`, `client_secret` and other info for use with this module.

Visit the [OAuth Documentation Page](https://www.patreon.com/oauth2/documentation) **while logged in as a Patreon creator on patreon.com** to register your client.


## Installation

Install with [npm](https://www.npmjs.com). You'll need to have [Node.js](https://nodejs.org) installed.

```
npm install --save patreon
```


## Usage

When you see `'pppp'` replace `pppp` with the data you received setting up
your OAuth account or otherwise suggested by the inline comments.

```js
var url = require('url')
var patreon = require('patreon')
var patreonAPI = patreon.default
var patreonOAuth = patreon.oauth

// Use the client id and secret you received when setting up your OAuth account
var CLIENT_ID = 'pppp'
var CLIENT_SECRET = 'pppp'
var patreonOAuthClient = patreonOAuth(CLIENT_ID, CLIENT_SECRET)

// This should be one of the fully qualified redirect_uri you used when setting up your oauth account
var redirectURL = 'http://mypatreonapp.com/oauth/redirect'

function handleOAuthRedirectRequest(request, response) {
    var oauthGrantCode = url.parse(request.url, true).query.code

    patreonOAuthClient.getTokens(oauthGrantCode, redirectURL, function (tokensError, tokens) {
        var patreonAPIClient = patreonAPI(tokens.access_token)

        patreonAPIClient(`/current_user`, function (currentUserError, apiResponse) {
            if (currentUserError) {
                console.error(currentUserError)
                response.end(currentUserError)
            }

            response.end(apiResponse)
        })
    })
}
```

If you're using [babel](https://babeljs.io) or writing [es2015](https://babeljs.io/docs/learn-es2015/) code:

```js
import url from 'url'
import patreonAPI, { oauth as patreonOAuth } from 'patreon'

const CLIENT_ID = 'pppp'
const CLIENT_SECRET = 'pppp'
const patreonOAuthClient = patreonOAuth(CLIENT_ID, CLIENT_SECRET)

const redirectURL = 'http://mypatreonapp.com/oauth/redirect'

function handleOAuthRedirectRequest(request, response) {
    const oauthGrantCode = url.parse(request.url, true).query.code

    patreonOAuthClient.getTokens(oauthGrantCode, redirectURL, (tokensError, { access_token }) => {
        const patreonAPIClient = patreonAPI(access_token)

        patreonAPIClient(`/current_user`, (currentUserError, apiResponse) => {
            if (currentUserError) {
                console.error(currentUserError)
                response.end(currentUserError)
            }

            response.end(apiResponse);
        })
    })
})
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

`pathname` API resource path like `/current_user`.
`callback` Called with an `err` if there is one, `body` is the [json:api](http://jsonapi.org)
response for the resource.


## API Resources

### Routes

`/current_user`  
`/current_user/campaigns`
`/campaigns/${campaign_id}/pledges`

### Response Format

You can request specific [related resources](http://jsonapi.org/format/#fetching-includes)
and or [resource attributes](http://jsonapi.org/format/#fetching-sparse-fieldsets)
that you want returned by our API, as per the [JSON:API specification](http://jsonapi.org/).
The lists of valid `includes` and `fields` arguments are provided in `patreon/schemas`.
For instance, if you wanted to request the total amount a patron has ever paid to your campaign,
which is not included by default, you could do:
```js
const patreonAPIClient = patreonAPI(access_token)
const url = jsonApiURL(`/current_user`, {
  fields: {
    pledge: [...pledge_schema.default_attributes, pledge_schema.attributes.total_historical_amount_cents]
  }
})
patreonAPIClient(url, callback)
```
