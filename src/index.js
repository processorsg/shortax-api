const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const morgan = require('morgan')
const helmet = require('helmet')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./db/mongo')
const userRouter = require('./routers/userRouter')
const urlRouter = require('./routers/urlRouter')

const app = express()

//Loading confing file in development mode
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

//connecting DB
connectDB()

//Express Middlewares
app.use(express.json())

//User sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//logger and helmet for security
app.use(morgan('dev'))
app.use(helmet())

app.use(userRouter)
app.use(urlRouter)
app.listen(process.env.PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))