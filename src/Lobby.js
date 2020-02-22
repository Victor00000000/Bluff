import React from 'react'
import './Lobby.css'

class Lobby extends React.Component {
  constructor(props) {
    super(props)
    this.state = { rooms: [] }
  }

  async componentDidMount() {
    let res = await fetch('http://localhost:4000')
    let json = await res.json()
    console.log(json)
    // this.setState()
  }

  render() {
    let rooms = this.state.rooms.map( (room) => {
      return <RoomLink to={room}/>
    } )

    return (
      <div>
        <div id="room-container">
          {rooms}
        </div>
        <form action="/room" method="POST">
          <input name="room" type="text" required/>
          <button type="submit">New Room</button>
        </form>
      </div>
    )
  }
}

class RoomLink extends React.Component {
  render() {
    return <a href={'/'+this.props.to}>{this.props.to}</a>
  }
}

export default Lobby
