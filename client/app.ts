// Import modules
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import logger from './utils/Logger'

// Import routes
import UserRouter from './routes/User'
import AuthRouter from './routes/Auth'
import BlogRouter from './routes/Blog'
import RootRouter from './routes/Root'

// Initialize the project
const app = express()

// Middlewares
app.use(express.json())
app.use(
    express.urlencoded({
        extended: false,
    })
)
app.use((req, res, next) => {
    next()
    logger.info(
        `[${req.method.toUpperCase()}] [${req.socket.remoteAddress}] ${req.url}`
    )
})
app.use(cookieParser())

// Routes
app.use('/users', UserRouter)
app.use('/auth', AuthRouter)
app.use('/blogs', BlogRouter)
app.use('/', RootRouter)
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use(function(req, res, next) {
    res.render("web/error.ejs", {
      page: {
        status: 404,
        message: "You're lost",
        title: "CFrum | Not Found",
        color: "red",
        redirect: "/"
      },
    });
})

// Application Configurations
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

export { app }
