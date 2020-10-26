import io from 'socket.io-client'

// single socket instance
let socket = null

function getSocket (forceCreateAnother = false) {
  if (socket && !forceCreateAnother) {
    return socket
  }
  const token = localStorage.getItem("user")
  console.log(token, 'token')
  socket = io('localhost:3000', {
    // path: '/socket',
    reconnection: true,
    autoConnect: !!token,
    reconnectionDelay: 5000,
    reconnectionFactor: 5000,
    transports: ['websocket', 'polling'],
    query: {
      token,
    },
  })
  socket.on('reconnect_attempt', () => {
    const token = localStorage.getItem("user")
    socket.io.opts.query = {
      token
    }
  })
  window.socket = socket
  return socket
}
export default getSocket