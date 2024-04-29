import { ReactiveController, ReactiveControllerHost } from 'lit'
import { compressSDP } from '../../shared/lib/crypto'

export class PeerController implements ReactiveController {
  constructor(host: ReactiveControllerHost) {
    ;(this.host = host).addController(this)
  }

  host: ReactiveControllerHost

  peerConnection?: RTCPeerConnection
  channel?: RTCDataChannel

  private _setupDataChannel() {
    if (!this.peerConnection) return

    this.channel = this.peerConnection.createDataChannel('bell')

    this.channel.onopen = (e) => {
      console.log('channel open', e)
    }

    this.channel.onmessage = (e) => {
      console.log('message:', e.data)
    }
  }

  private _setupPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        // TODO: разобраться, какого хуя TURN а не STUN
        {
          urls: 'TURN:freeturn.net:3478',
          username: 'free',
          credential: 'free',
        },
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    })

    this.peerConnection.onicecandidate = (e) => {
      const peerConnection = e.target as RTCPeerConnection
      const { candidate } = e

      // console.log(candidate)
      console.log(peerConnection.localDescription)
      console.log(compressSDP(peerConnection.localDescription))

      this.host.requestUpdate() // TODO: выпилить отсюда, что бы не мешать логику
    }

    this.peerConnection.ondatachannel = (e) => {
      this.channel = e.channel
    }
  }

  peerConnection2?: RTCPeerConnection
  channel2?: RTCDataChannel

  /**
   * Метод реализует механизм автоматического обновления соединения по схеме PC1 -> PC2
   */
  autoUpgradePeerConnection() {
    if (!this.peerConnection) return
    // 1. метод подписывается на `onnegotiationneeded` у PC1
    // 1.1 после того как событие сработает, будет создан PC2
    // 1.2 PC2 создаст свой offer, который будет храниться в localDescription
    // 2. созданный у PC2 offer будет отправлен через dataChannel(PC1) удаленному пиру

    this.peerConnection.onnegotiationneeded = async (e) => {
      console.log('onnegotiationneeded', e)
      const peerConnection = e.target as RTCPeerConnection

      if (
        ['connected', 'connecting'].includes(peerConnection.connectionState)
      ) {
        // TODO: нужно добавлять к текущему мемберу еще один пир коннект, генерировать оффер, отправлять его по первому пир коннект через дата канал
        // на стороне получателя: нужно добавлять к текущему мемберу еще один пир коннект, генерировать ответ, отправлять его по первому пир коннект через дата канал
        // как только второй пир коннект становится успешным, удалять первый

        const peerController = new PeerController(this.host)
        this.peerConnection2 = peerController.peerConnection

        console.log('PC2', this.peerConnection2)

        // TODO: если viewer имеет стрим, подождать пока в peer не будут добавлены треки
        // или можно не подвязывать на это, а просто реализовать механизм апгрейда коннекта
        if (this.host.viewer?.stream) {
          const tracks = this.host.viewer.stream.getTracks()
          for await (let track of tracks) {
            this.peerConnection2.addTrack(track, this.host.viewer.stream)
          }
        }

        const offer = await this.peerConnection2.createOffer()
        this.peerConnection2.setLocalDescription(offer)

        this.channel?.send(JSON.stringify(offer))
      }
    }

    // NOTE: добавляем слушателя сообщений, что бы на удаленном пиру получать оффер
    // FIXME: уже выше есть слушатель, надо решить как их обьединить при вызове autoUpgradePeerConnection
    this.channel.onmessage = async (e) => {
      console.log('new message:', e)
      const SDP = JSON.parse(e.data)
      console.log('SDP', SDP)

      if (SDP.type === 'offer') {
        // тут нужно написать код, который будет отрабатывать на удаленном пире
        // нужно принимать создавать PC2
        // нужно присваивать PC2 remoteDescription
        // нужно создавать ответ и отправлять его по первому каналу

        const peerController = new PeerController(this.host)
        this.peerConnection2 = peerController.peerConnection

        console.log('PC2', this.peerConnection2)

        // TODO: если viewer имеет стрим, подождать пока в peer не будут добавлены треки
        // или можно не подвязывать на это, а просто реализовать механизм апгрейда коннекта
        if (this.host.viewer?.stream) {
          const tracks = this.host.viewer.stream.getTracks()
          for await (let track of tracks) {
            this.peerConnection2.addTrack(track, this.host.viewer.stream)
          }
        }

        this.peerConnection2.setRemoteDescription(SDP)

        const answer = await this.peerConnection2.createAnswer()
        this.peerConnection2.setLocalDescription(answer)

        this.channel?.send(JSON.stringify(answer))
      }

      if (SDP.type === 'answer') {
        this.peerConnection2.setRemoteDescription(SDP)
      }

      // // TODO: понять, когда PC2 стал стабильным, и заменить PC1 на PC2
      // this.peerConnection2.onconnectionstatechange = (e) => {
      //   console.log(e)
      // }
    }
  }

  hostConnected() {
    // When the host is connected
    this._setupPeerConnection()
    this._setupDataChannel()
  }
  hostDisconnected() {
    // When the host is disconnected
  }
}
