import type { ServerWebSocket } from 'bun'

interface IWebSocketData {
  id: string
}

const sockets = new Map<string, ServerWebSocket<unknown>>()

function handleLogin(ws: ServerWebSocket<IWebSocketData>, id: string) {
  ws.data = { id }
  sockets.set(id, ws)
  console.log('User logged in:', id)
}

function handleOffer(
  ws: ServerWebSocket<IWebSocketData>,
  { to, sdp }: { to: string; sdp: string }
) {
  const toWS = sockets.get(to)

  if (toWS) {
    const data = {
      eventName: 'receiveOffer',
      data: {
        from: ws.data!.id,
        sdp,
      },
    }
    toWS.send(JSON.stringify(data))
  } else {
    ws.send("There's no user")
    console.log("There's no user")
  }
}

function handleAnswer(
  ws: ServerWebSocket<IWebSocketData>,
  { to }: { to: string }
) {
  const toWS = sockets.get(to)

  if (toWS) {
    toWS.send(`Hey, ${ws.data!.id} took your call`)
  } else {
    ws.send("There's no user")
    console.log("There's no user")
  }
}

const server = Bun.serve<IWebSocketData>({
  port: 3000,

  fetch(req, server) {
    if (server.upgrade(req)) {
      return
    }
    return new Response('Upgrade failed :(', { status: 500 })
  },
  websocket: {
    open(ws) {
      console.log('Socket connected', ws.remoteAddress)
    },
    message(ws, message) {
      console.log('Received new Message')
      if (typeof message === 'object') return

      let msg
      try {
        msg = JSON.parse(message)
        console.log(msg)
      } catch (error) {
        console.log('Failed to parse message:', error)
        return
      }

      switch (msg.eventName) {
        case 'login':
          handleLogin(ws, msg.data.id)
          break
        case 'offer':
          handleOffer(ws, msg.data)
          break
        case 'answer':
          handleAnswer(ws, msg.data)
          break
        default:
          console.log('Unknown event:', msg.eventName)
      }
    },
    close(ws) {
      console.log('Socket disconnected', ws.remoteAddress)
      sockets.delete(ws.data.id)
    },
  },
})

console.log(`Listening on ${server.hostname}:${server.port}`)
