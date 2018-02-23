require('dotenv').load()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('./config/auth')
const { games, users, sessions, gamePlayers } = require('./routes')
const http = require('http')
const socketAuth = require('./config/socket-auth')
const socketIO = require('socket.io')

const port = process.env.PORT || 3030

const app = express()
const server = http.Server(app)
const io = socketIO(server)

io.use(socketAuth);

io.set('transports', ['websocket', 'polling'])

io.on('connect', socket => {
  socket.emit('ping', `Welcome to the server, ${socket.request.user.email}`)
  console.log(`${socket.request.user.email} connected to the server`)
})

const getOrigin =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://www.l2elexilon.com'

var corsOptions = {
  origin: getOrigin,
  optionsSuccessStatus: 200
}

app
  .use(cors(corsOptions))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(passport.initialize())
  .use(games(io))
  .use(gamePlayers(io))
  .use(users)
  .use(sessions)

  // catch 404 and forward to error handler
  .use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  .use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    })
  })

server.listen(port)
