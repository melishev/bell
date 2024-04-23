import * as spdCompact from 'sdp-compact'

export function compressSDP(sdp: RTCSessionDescriptionInit) {
  return spdCompact.compact(sdp)
}

export function decompressSDP(compressedSDP: string) {
  return spdCompact.decompact(compressedSDP)
}
