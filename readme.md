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

    patreonOAuthClient
        .getTokens(oauthGrantCode, redirectURL)
        .then(function(tokensResponse) {
            var patreonAPIClient = patreonAPI(tokensResponse.access_token)
            return patreonAPIClient('/current_user')
        })
        .then(function(result) {
            var store = result.store
            // store is a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore)
            // You can also ask for result.rawJson if you'd like to work with unparsed data
            response.end(store.findAll('user').map(user => user.serialize()))
        })
        .catch(function(err) {
            console.error('error!', err)
            response.end(err)
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

    patreonOAuthClient
        .getTokens(oauthGrantCode, redirectURL)
        .then(tokensResponse => {
            const patreonAPIClient = patreonAPI(tokensResponse.access_token)
            return patreonAPIClient('/current_user')
        })
        .then(({ store }) => {
            // store is a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore)
            // You can also ask for result.rawJson if you'd like to work with unparsed data
            response.end(store.findAll('user').map(user => user.serialize()))
        })
        .catch(err => {
            console.error('error!', err)
            response.end(err)
        })
}
```

You can also reference the included [server example](/examples/server.js).


## Methods

### var patreonOAuthClient = oauth(clientId, clientSecret)

Returns an object containing functions for fetching OAuth access tokens.

`clientId` The client id you received after setting up your OAuth account.  
`clientSecret` The client secret you received after setting up your OAuth account.

### patreonOAuthClient.getTokens(redirectCode, redirectUri)

This makes a request to grab tokens needed for making API requests, and returns a promise.

`redirectCode` Use the `code` query param provided to your OAauth redirect route.  
`redirectUri` This should be the same redirect route you provided in the initial auth request.

The promise will be resolved with the parsed JSON containing a `tokens` response object,
or will be rejected with an error message.

The `tokens` object will look something like this:

```js
{
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires_in: 'time_window',
    scope: 'users pledges-to-me my-campaign',
    token_type: 'Bearer'
}
```

You must pass `tokens.access_token` in to `patreon` for making API calls.

### var client = patreon(accessToken)

Returns a function for making authenticated API calls.

### client(pathname)

Returns a promise representing the result of the API call.

`pathname` API resource path like `/current_user`.

If the API call is successful, the promise will resolve with an object containing three pieces:
* `store`: a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore). This provides a nice, usable wrapper around the raw [JSON:API response](http://jsonapi.org) to easily access related resources and resource attributes.
* `rawJson`: a JSON object in the [JSON:API](http://jsonapi.org)
format, for advanced custom usage (say, parsing into your own JSON:API data store)
* `response`: the actual [`fetch` `Response` object](https://developer.mozilla.org/en-US/docs/Web/API/Response), for the lowest level of response analysis

If the API call is unsuccessful, the promise will reject with an error.



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
const { patreonAPI, jsonApiURL } = require('patreon')
const pledge_schema = require('patreon/schemas/pledge')

const patreonAPIClient = patreonAPI(access_token)
const url = jsonApiURL(`/current_user`, {
  fields: {
    pledge: [...pledge_schema.default_attributes, pledge_schema.attributes.total_historical_amount_cents]
  }
})
patreonAPIClient(url, callback)
```
