import { ReactiveController, ReactiveControllerHost } from 'lit'

export class PeerController implements ReactiveController {
  constructor(host: ReactiveControllerHost) {
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

    host.addController(this)
  }

  host: ReactiveControllerHost

  peerConnection: RTCPeerConnection
  channel: RTCDataChannel
  stream: MediaStream

  private peerController?: PeerController
  private newPeerConnection?: RTCPeerConnection
  private newChannel?: RTCDataChannel

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
    this.peerConnection.onicecandidate = (e) => {
      this.host.requestUpdate()
    }

    this.peerConnection.ondatachannel = (e) => {
      this.channel = e.channel
    }

    this.peerConnection.ontrack = (e) => {
      this.stream = e.streams[0]
      // console.log(e.streams[0].getTracks())

      // this.stream.getTracks().forEach((track) => {
      //   this.stream.removeTrack(track)
      // })

      // e.streams[0].getTracks().forEach((track) => {
      //   this.stream.addTrack(track)
      // })
      // this.stream = e.streams[0]
      //   this.host.dispatchEvent(
      //     new CustomEvent('update:member', {
      //       composed: true,
      //       detail: { ...this.member, stream: e.streams[0] },
      //     })
      //   )
    }
  }

  // private _updatePeerConnection() {
  //   this.peerConnection =
  // }

  async addTrackToPeerConnection(stream: MediaStream) {
    const tracks = stream.getTracks()

    for await (let track of tracks) {
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
      if (
        ['connected', 'connecting'].includes(
          this.peerConnection.connectionState
        )
      ) {
        this.peerController = new PeerController(this.host)
        this.newPeerConnection = this.peerController.peerConnection
        this.newChannel = this.peerController.channel

        this.newPeerConnection.onicecandidate = (e) => {
          if (this.newPeerConnection?.iceGatheringState === 'complete') {
            this.channel.send(
              JSON.stringify(this.newPeerConnection.localDescription)
            )
          }
        }

        this.newPeerConnection.onconnectionstatechange = (e) => {
          if (this.newPeerConnection?.connectionState === 'connected') {
            this.peerConnection.close()
            this._switchPeerConnection()
          }
        }

        // FIXME:
        if (this.host.viewer?.stream) {
          await this.peerController.addTrackToPeerConnection(
            this.host.viewer.stream
          )
        }

        const offer = await this.newPeerConnection.createOffer()
        this.newPeerConnection.setLocalDescription(offer)
      }
    }

    this.channel.onmessage = async (e) => {
      const SDP = JSON.parse(e.data)

      if (SDP.type === 'offer') {
        this.peerController = new PeerController(this.host)
        this.newPeerConnection = this.peerController.peerConnection
        this.newChannel = this.peerController.channel

        this.newPeerConnection.onicecandidate = (e) => {
          if (this.newPeerConnection?.iceGatheringState === 'complete') {
            this.channel.send(
              JSON.stringify(this.newPeerConnection.localDescription)
            )
          }
        }

        this.newPeerConnection.onconnectionstatechange = (e) => {
          if (this.newPeerConnection?.connectionState === 'connected') {
            this.peerConnection.close()
            this._switchPeerConnection()
          }
        }

        if (this.host.viewer?.stream) {
          await this.peerController.addTrackToPeerConnection(
            this.host.viewer.stream
          )
        }

        this.newPeerConnection.setRemoteDescription(
          new RTCSessionDescription(SDP)
        )

        const answer = await this.newPeerConnection.createAnswer()
        this.newPeerConnection.setLocalDescription(answer)
      }

      if (SDP.type === 'answer') {
        this.newPeerConnection.setRemoteDescription(
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
