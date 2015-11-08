import patreon, { oauth } from '../src/patreon'

import express from 'express'
import { format as formatUrl } from 'url'
import jsonMarkup from 'json-markup'
import fs from 'fs'

const jsonStyles = fs.readFileSync(__dirname + '/../node_modules/json-markup/style.css')

const app = express()

const id = process.env.PATREON_CLIENT_ID
const secret = process.env.PATREON_CLIENT_SECRET

// redirect_uri should be the full redirect url
const redirect = 'http://localhost:5000/oauth/redirect'

const loginUrl = formatUrl({
    protocol: 'https',
    host: 'patreon.com',
    pathname: '/oauth2/authorize',
    query: {
        response_type: 'code',
        client_id: id,
        redirect_uri: redirect,
        state: 'chill'
    }
})

app.get('/', (req, res) => {
    res.send(`<a href="${loginUrl}">Login with Patreon</a>`)
})

app.get('/oauth/redirect', (req, res) => {
    const { code } = req.query
    const { getTokens } = oauth(id, secret)

    getTokens(code, redirect, (err, { access_token }) => {
        if (err) {
            console.error(err)
            return res.send(err.message)
        }

        const client = patreon(access_token)

        client('/current_user', (uerr, user) => {
            if (uerr) return console.error(uerr)

            client('/current_user/campaigns', (cerr, campaigns) => {
                if (cerr) return console.error(cerr)

                res.send(
                    oauthExampleTpl({ user, campaigns })
                )
            })
        })
    })
})

const server = app.listen(5000, () => {
    const { port } = server.address()
    console.log(`Listening on http:/localhost:${port}`)
})

function oauthExampleTpl ({user, campaigns}) {
    return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Oath Results</title>
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
            <h1>Oauth Example</h1>

            <h2>/current_user</h2>
            <div class="jsonsample">${jsonMarkup(user)}</div>

            <h2>/current_user/campaigns</h2>
            <div class="jsonsample">${jsonMarkup(campaigns)}</div>
        </div>
    </body>
</html>`
}
