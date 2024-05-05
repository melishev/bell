import { ReactiveController, ReactiveControllerHost } from 'lit'

export class PeerController implements ReactiveController {
  constructor(host: ReactiveControllerHost, viewerStream: MediaStream) {
    this.host = host

    this.stream = new MediaStream()

    this.viewerStream = viewerStream

    host.addController(this)
  }

  host: ReactiveControllerHost

  peerConnection!: RTCPeerConnection
  channel!: RTCDataChannel
  stream: MediaStream

  private viewerStream: MediaStream

  private peerConnection2?: RTCPeerConnection
  private channel2?: RTCDataChannel

  private _setupDataChannel(pc: RTCPeerConnection): RTCDataChannel {
    const channel = pc.createDataChannel('bell')

    channel.onopen = (e) => {
      console.log('channel open', e)
    }

    channel.onmessage = (e) => {
      console.log('message:', e.data)
    }

    return channel
  }

  private _setupPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'TURN:freeturn.net:3478',
          username: 'free',
          credential: 'free',
        },
      ],
    })

    if (this.viewerStream.getTracks().length) {
      this.addTrackToPeerConnection(pc)
    }

    pc.onicecandidate = (e) => {
      this.host.requestUpdate()
    }

    pc.ondatachannel = (e) => {
      this.channel = e.channel
    }

    pc.ontrack = (e) => {
      for (let track of this.stream.getTracks()) {
        this.stream.removeTrack(track)
      }

      for (let track of e.streams[0].getTracks()) {
        this.stream.addTrack(track)
      }
    }

    return pc
  }

  addTrackToPeerConnection(pc?: RTCPeerConnection) {
    for (let track of this.viewerStream.getTracks()) {
      ;(pc || this.peerConnection).addTrack(track, this.viewerStream)
    }
  }

  private _switchPeerConnection() {
    if (!(this.peerConnection2 && this.channel2)) return

    this.peerConnection.close()
    this.channel.close()

    this.peerConnection = this.peerConnection2
    this.channel = this.channel2

    delete this.peerConnection2
    delete this.channel2

    this._autoUpgradePeerConnection()
  }

  /** Method implements the mechanism of automatic connection update according to the scheme PC1 -> PC2 */
  private _autoUpgradePeerConnection() {
    this.peerConnection.onnegotiationneeded = async (e) => {
      if (['connected'].includes(this.peerConnection.connectionState)) {
        this.peerConnection2 = this._setupPeerConnection()
        this.channel2 = this._setupDataChannel(this.peerConnection2)

        this.peerConnection2.onicecandidate = (e) => {
          if (this.peerConnection2?.iceGatheringState === 'complete') {
            this.channel.send(
              JSON.stringify(this.peerConnection2.localDescription)
            )
          }
        }

        this.peerConnection2.onconnectionstatechange = (e) => {
          if (this.peerConnection2?.connectionState === 'connected') {
            this._switchPeerConnection()
          }
        }

        const offer = await this.peerConnection2.createOffer()
        this.peerConnection2.setLocalDescription(offer)
      }
    }

    this.channel.onmessage = async (e) => {
      const SDP = JSON.parse(e.data)

      if (SDP.type === 'offer') {
        this.peerConnection2 = this._setupPeerConnection()
        this.channel2 = this._setupDataChannel(this.peerConnection2)

        this.peerConnection2.onicecandidate = (e) => {
          if (this.peerConnection2?.iceGatheringState === 'complete') {
            this.channel.send(
              JSON.stringify(this.peerConnection2.localDescription)
            )
          }
        }

        this.peerConnection2.onconnectionstatechange = (e) => {
          if (this.peerConnection2?.connectionState === 'connected') {
            this._switchPeerConnection()
          }
        }

        this.peerConnection2.setRemoteDescription(
          new RTCSessionDescription(SDP)
        )

        const answer = await this.peerConnection2.createAnswer()
        this.peerConnection2.setLocalDescription(answer)
      }

      if (SDP.type === 'answer') {
        this.peerConnection2?.setRemoteDescription(
          new RTCSessionDescription(SDP)
        )
      }
    }
  }

  hostConnected() {
    // When the host is connected
    this.peerConnection = this._setupPeerConnection()
    this.channel = this._setupDataChannel(this.peerConnection)

    this._autoUpgradePeerConnection()
  }
  hostDisconnected() {
    // When the host is disconnected
  }
}
