'use strict'
var iceServers= [{
   urls: 'stun:stun.l.google.com:19302'
}]

function createPeer (stream) {
  console.log('createPeer', stream)

	var pc = new RTCPeerConnection({ iceServers: iceServers })
  // create a bogus data channel
  // pc.createDataChannel('a')
  if (pc.addTrack) {
    stream.getTracks().forEach(function (track) {
      console.log('addTrack', track)
      pc.addTrack(track, stream)
    })
  } else {
    pc.addStream(stream)
  }

  pc.onicecandidate = function (e) {
    if (e && e.candidate) {
      console.log('icecandidate', e.candidate.sdpMLineIndex, e.candidate.sdpMid)
    }
  }

  return pc.createOffer()
  .then(pc.setLocalDescription.bind(pc))
  .then(function () { return 'ok' })
}

window.navigator.mediaDevices.getUserMedia({ audio: true, video: true })
.then(createPeer)
.then(console.log.bind(console))
.catch(console.error.bind(console))
