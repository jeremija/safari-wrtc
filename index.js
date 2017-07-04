'use strict'
var iceServers= [{
   urls: 'stun:stun.l.google.com:19302'
}]

var $log = window.document.getElementById('log')
var start = Date.now()

function log () {
	console.log.apply(console, arguments)
	try {
		var time = (Date.now() - start) / 1000 + 's'
		var p = window.document.createElement('p')
		p.textContent = Array.prototype.slice.call(arguments).join(' ') +
			' (' + time + ')'
		$log.appendChild(p)
	} catch (err) {}
}

function createPeer (stream) {
  log('createPeer', stream)

	var pc = new RTCPeerConnection({ iceServers: iceServers })

  if (pc.addTrack) {
    stream.getTracks().forEach(function (track) {
      log('addTrack', track)
      pc.addTrack(track, stream)
    })
  } else {
    pc.addStream(stream)
  }

  pc.onicecandidate = function (e) {
    if (e && e.candidate) {
      log('icecandidate', e.candidate.sdpMLineIndex, e.candidate.sdpMid)
    }
  }

  return pc.createOffer()
  .then(pc.setLocalDescription.bind(pc))
  .then(function () { return 'ok' })
}

window.navigator.mediaDevices.getUserMedia({ audio: true, video: true })
.then(createPeer)
.then(log)
.catch(err => log(err.name, err.message))
