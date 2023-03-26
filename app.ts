import express from 'express'
import config from 'config'
import { createServer } from 'http'
import { app as BackendApp } from "./server/app"
import { app as FrontendApp } from "./client/app"
import { HashPassword } from './server/utils/User'

const app = express()
const server = createServer(app);

app.use('/api', BackendApp)
app.use('/', FrontendApp)

server.listen(config.get('general.server.port') as number, undefined, () => {
    console.log(`Listening on port ${config.get('general.server.port')}`)
});

// (async() => {
//     console.log(await HashPassword("baolam2010"))
// })()