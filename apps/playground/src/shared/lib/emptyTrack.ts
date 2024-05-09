export function createEmptyVideoTrack({ width = 640, height = 480 } = {}) {
  const canvas = Object.assign(document.createElement('canvas'), {
    width,
    height,
  })
  canvas.getContext('2d')?.fillRect(0, 0, width, height)
  const stream = canvas.captureStream()
  return Object.assign(stream.getVideoTracks()[0], { enabled: false })
}

export function createEmptyAudioTrack() {
  const ctx = new AudioContext()
  const oscillator = ctx.createOscillator()
  const dst = oscillator.connect(ctx.createMediaStreamDestination())
  // oscillator.start()
  return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
}
