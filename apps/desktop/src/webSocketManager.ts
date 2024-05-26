import WebSocket from 'ws'
import { createWindow as createWindowPicture } from './picture/main' // FIXME:

export function initializeWebSocket(localData) {
  let ws: WebSocket

  function connect() {
    ws = new WebSocket('ws://192.168.1.101:3000', {
      perMessageDeflate: false,
    })

    ws.on('open', () => {
      const eventData = {
        eventName: 'login',
        data: {
          id: localData.id,
        },
      }
      ws.send(JSON.stringify(eventData))
    })

    ws.on('message', (e) => {
      console.log('Received message')
      const message = JSON.parse(e)

      // пользователю пришел звонок, необходимо открыть окно, и спросить, принимает он звонок или нет
      // положить полученный sdp в remote, сгенерить ответ, отправить на сервер
      if ('eventName' in message && message.eventName === 'receiveOffer') {
        createWindowPicture(ws, message.data.from, 'incoming', message.data.sdp)
      }
    })

    ws.on('close', () => {
      console.log('Connection lost, attempting to reconnect...')
      setTimeout(connect, 5000) // Пауза перед повторной попыткой переподключения
    })

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message)
      ws.close()
    })
  }

  connect()
  return ws
}
