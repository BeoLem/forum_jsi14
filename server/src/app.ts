// Import modules
import config from 'config'
import express from 'express'
import { createServer } from 'http'

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import logger from './utils/Logger'

// Import routes
import UserRouter from './routes/User'
import SessionRouter from './routes/Session'
import BlogRouter from './routes/Blog'

// Initialize the project
const app = express()
const server = createServer(app)
const fb = initializeApp(config.get('firebase.config'))
const database = getFirestore(fb)

// Middlewares
app.use(express.json())
app.use(
    express.urlencoded({
        extended: false,
    })
)
app.use((req, res, next) => {
    next()

    res.on('finish', () => {
        res.statusCode.toString().startsWith('2')
            ? logger.info(
                  `[${req.method.toUpperCase()}] [${
                      req.socket.remoteAddress
                  }] [${res.statusCode}] ${req.url}`
              )
            : logger.warn(
                  `[${req.method.toUpperCase()}] [${
                      req.socket.remoteAddress
                  }] [${res.statusCode}] ${req.url}`
              )
    })
})

// Routes
app.use('/users', UserRouter)
app.use('/sessions', SessionRouter)
app.use('/blogs', BlogRouter)

server.listen(config.get('server.port') as number, undefined, () => {
    logger.info(`Listening on port ${config.get('server.port')}`)
})

export { database }
