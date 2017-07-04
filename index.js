'use strict'
const iceServers= [{
   urls: 'stun:stun.l.google.com:19302'
}]

function createPeer (stream) {
  console.log('createPeer', stream)

	const pc = new RTCPeerConnection({ iceServers })
  // create a bogus data channel
  // pc.createDataChannel('a')

  stream.getTracks().forEach(track => {
    console.log('addTrack', track)
    pc.addTrack(track, stream)
  })

  pc.onicecandidate = e => {
    if (e && e.candidate) {
      console.log('icecandidate', e.candidate.sdpMLineIndex, e.candidate.sdpMid)
    }
  }

  return pc.createOffer()
  .then(pc.setLocalDescription.bind(pc))
  .then(() => 'ok')
}

window.navigator.mediaDevices.getUserMedia({ audio: true, video: true })
.then(createPeer)
.then(console.log.bind(console))
.catch(console.error.bind(console))
