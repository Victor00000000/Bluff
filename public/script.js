const socket = io('http://localhost:4000')
const roomConainer = document.getElementById('room-container')
const readyButton = document.getElementById('ready-button')

let ids = {}

if (roomConainer == null) {
  const name = prompt('What is your name?')
  socket.emit('new-user', roomName, name)

  readyButton.addEventListener('click', (event) => {
    socket.emit('ready', roomName)
  })
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomConainer.append(roomElement)
  roomConainer.append(roomLink)
})

socket.on('user-connected', (newUser) => {
  console.log('new user joined')
  ids.push(newUser)
  console.log(ids)
})

socket.on('connection-data', obj => {
  ids = obj
  console.log(ids)
})

