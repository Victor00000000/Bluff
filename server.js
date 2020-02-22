const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

const rooms = {}

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: [], bid: [0, 0], totalDice: 5, status: 'Not-Ready' }
  res.redirect(req.body.room)
  // Send message that new room was created
  console.log('room created')
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  if (Object.keys(rooms[req.params.room].users).length > 5 || rooms[req.params.room].status === 'Ready') {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

server.listen(3000)

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    socket.join(room)
    console.log(rooms)
    obj = {socket: socket.id, name: name, nbrDice: 5, dice: [], status: 'Not-Ready'}
    rooms[room].users.push(obj)
    socket.to(room).broadcast.emit('user-connected', obj)
    socket.emit('connection-data', rooms[room].users)
    console.log(rooms)
  })
  socket.on('disconnect', () => {
    console.log('disconnected')
    for (room in rooms) {
      for (let i = rooms[room].users.length - 1; i >= 0; i--) {
        if (rooms[room].users[i] === socket.id) {
          delete rooms[room].users[i]
        }
      }
      if (rooms[room].users.length === 0) {
        //delete rooms[room]
      }
    }
  })
  socket.on('ready', room => {
    for (let i = rooms[room].users.length - 1; i >= 0; i--) {
      if (rooms[room].users[i] === socket.id) {
        rooms[room].users[i].status = 'Ready'
        break
      }
    }
    CheckReadyStatusForRoom(room)
    console.log(rooms[room].status)
  })
})

const CheckReadyStatusForRoom = (room) => {
  ready = true
  for (user in rooms[room].users) {
    if (user.status === 'Not-Ready') {
      ready = false
      break
    }
  }
  if (ready) {
    rooms[room].status = 'Ready'
  }
}