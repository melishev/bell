import { ReactiveController, ReactiveControllerHost } from 'lit'

export class PeerController implements ReactiveController {
  constructor(host: ReactiveControllerHost, viewerStream: MediaStream) {
    this.host = host

    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // {
        //   urls: 'TURN:freeturn.net:3478',
        //   username: 'free',
        //   credential: 'free',
        // },
      ],
    })
    this.channel = this.peerConnection.createDataChannel('bell')
    this.stream = new MediaStream()

    this.viewerStream = viewerStream

    host.addController(this)
  }

  host: ReactiveControllerHost

  peerConnection: RTCPeerConnection
  channel: RTCDataChannel
  stream: MediaStream

  private viewerStream: MediaStream
  private peerController?: PeerController

  private _setupDataChannel() {
    if (!this.peerConnection) return

    this.channel.onopen = (e) => {
      console.log('channel open', e)
    }

    this.channel.onmessage = (e) => {
      console.log('message:', e.data)
    }
  }

  private _setupPeerConnection() {
    if (this.viewerStream.getTracks().length) {
      this.addTrackToPeerConnection(this.viewerStream)
    }

    this.peerConnection.onicecandidate = (e) => {
      this.host.requestUpdate()
    }

    this.peerConnection.ondatachannel = (e) => {
      this.channel = e.channel
    }

    this.peerConnection.ontrack = (e) => {
      // console.log('receive tracks from remote peer')

      // this.stream.getTracks().forEach((track) => {
      //   this.stream.removeTrack(track)
      // })

      e.streams[0].getTracks().forEach((track) => {
        this.stream.addTrack(track)
      })
    }
  }

  addTrackToPeerConnection(stream: MediaStream) {
    const tracks = stream.getTracks()

    for (let track of tracks) {
      this.peerConnection.addTrack(track, stream)
    }
  }

  private _switchPeerConnection() {
    if (!this.peerController) return

    this.peerConnection = this.peerController.peerConnection
    this.peerController.stream.getTracks().forEach((track) => {
      this.stream.addTrack(track)
    })
  }

  /** Method implements the mechanism of automatic connection update according to the scheme PC1 -> PC2 */
  private _autoUpgradePeerConnection() {
    this.peerConnection.onnegotiationneeded = async (e) => {
      console.log('onnegotiationneeded', this.peerConnection.connectionState)

      if (['connected'].includes(this.peerConnection.connectionState)) {
        this.peerController = new PeerController(this.host, this.viewerStream)

        this.peerController.peerConnection.onicecandidate = (e) => {
          if (
            this.peerController?.peerConnection.iceGatheringState === 'complete'
          ) {
            this.channel.send(
              JSON.stringify(
                this.peerController.peerConnection.localDescription
              )
            )
          }
        }

        this.peerController.peerConnection.onconnectionstatechange = (e) => {
          if (
            this.peerController?.peerConnection.connectionState === 'connected'
          ) {
            this.peerConnection.close()
            this._switchPeerConnection()
          }
        }

        const offer = await this.peerController.peerConnection.createOffer()
        this.peerController.peerConnection.setLocalDescription(offer)
      }
    }

    this.channel.onmessage = async (e) => {
      const SDP = JSON.parse(e.data)

      if (SDP.type === 'offer') {
        this.peerController = new PeerController(this.host, this.viewerStream)

        this.peerController.peerConnection.onicecandidate = (e) => {
          if (
            this.peerController?.peerConnection.iceGatheringState === 'complete'
          ) {
            this.channel.send(
              JSON.stringify(
                this.peerController.peerConnection.localDescription
              )
            )
          }
        }

        this.peerController.peerConnection.onconnectionstatechange = (e) => {
          if (
            this.peerController?.peerConnection.connectionState === 'connected'
          ) {
            this.peerConnection.close()
            this._switchPeerConnection()
          }
        }

        this.peerController.peerConnection.setRemoteDescription(
          new RTCSessionDescription(SDP)
        )

        const answer = await this.peerController.peerConnection.createAnswer()
        this.peerController.peerConnection.setLocalDescription(answer)
      }

      if (SDP.type === 'answer') {
        this.peerController?.peerConnection.setRemoteDescription(
          new RTCSessionDescription(SDP)
        )
      }
    }
  }

  hostConnected() {
    // When the host is connected
    this._setupPeerConnection()
    this._setupDataChannel()

    this._autoUpgradePeerConnection()
  }
  hostDisconnected() {
    // When the host is disconnected
  }
}
