import { oauth, patreon } from '../dist/index.js'

import express from 'express'
import { format as formatUrl } from 'url'
import jsonMarkup from 'json-markup'
import fs from 'fs'

const jsonStyles = fs.readFileSync(__dirname + '/../node_modules/json-markup/style.css')

const app = express()

const clientId = process.env.PATREON_CLIENT_ID
const clientSecret = process.env.PATREON_CLIENT_SECRET
// redirect_uri should be the full redirect url
const redirect = 'http://localhost:5000/oauth/redirect'

const oauthClient = oauth(clientId, clientSecret)

// mimic a database
let database = {}


const loginUrl = formatUrl({
    protocol: 'https',
    host: 'patreon.com',
    pathname: '/oauth2/authorize',
    query: {
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirect,
        state: 'chill'
    }
})

app.get('/', (req, res) => {
    res.send(`<a href="${loginUrl}">Login with Patreon</a>`)
})

app.get('/oauth/redirect', (req, res) => {
    const { code } = req.query
    let token

    return oauthClient.getTokens(code, redirect)
        .then(({ access_token }) => {
            token = access_token // eslint-disable-line camelcase
            const apiClient = patreon(token)
            return apiClient('/current_user')
        })
        .then(({ store, rawJson }) => {
            const { id } = rawJson.data
            database[id] = { ...rawJson.data, token }
            console.log(`Saved user ${store.find('user', id).full_name} to the database`)
            return res.redirect(`/protected/${id}`)
        })
        .catch((err) => {
            console.log(err)
            console.log('Redirecting to login')
            res.redirect('/')
        })
})

app.get('/protected/:id', (req, res) => {
    const { id } = req.params

    // load the user from the database
    const user = database[id]
    if (!user || !user.token) {
        return res.redirect('/')
    }

    const apiClient = patreon(user.token)

    // make api requests concurrently
    return apiClient('/current_user/campaigns')
        .then(({ store }) => {
            const _user = store.find('user', id)
            const campaign = _user.campaign ? _user.campaign.serialize().data : null
            const page = oauthExampleTpl({
                name: _user.first_name,
                campaigns: [campaign]
            })
            return res.send(page)
        }).catch((err) => {
            const { status, statusText } = err
            console.log('Failed to retrieve campaign info')
            console.log(err)
            return res.json({ status, statusText })
        })
})

const server = app.listen(5000, () => {
    const { port } = server.address()
    console.log(`Listening on http:/localhost:${port}`)
})

function oauthExampleTpl({ name, campaigns }) {
    return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>OAuth Results</title>
        <style>
            .container {
                max-width: 800px;
                margin: auto;
            }
            .jsonsample {
                max-height: 500px;
                overflow: auto;
                margin-bottom: 60px;
                border-bottom: 1px solid #ccc;
            }
        </style>
        <style>${jsonStyles}</style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome, ${name}!</h1>
            <h2>Campaigns</h2>
            <div class="jsonsample">${jsonMarkup(campaigns)}</div>
        </div>
    </body>
</html>`
}
