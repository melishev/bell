export function createEmptyVideoTrack({ width = 640, height = 480 } = {}) {
  const canvas = Object.assign(document.createElement('canvas'), {
    width,
    height,
  })
  canvas.getContext('2d')?.fillRect(0, 0, width, height)
  let stream = canvas.captureStream()
  return Object.assign(stream.getVideoTracks()[0], { enabled: false })
}

export function createEmptyAudioTrack() {
  let ctx = new AudioContext()
  let oscillator = ctx.createOscillator()
  let dst = oscillator.connect(ctx.createMediaStreamDestination())
  // oscillator.start()
  return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
}
