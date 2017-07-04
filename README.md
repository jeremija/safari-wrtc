# Safari Technology Preview Release 34 Bug Report

During the WRTC peer connection negotiation, onicecandidate callback will return a candidate object with `sdpMLineIndex` always set to `0`, which makes it impossible to establish peer connections with Firefox or Chrome.

From the spec https://www.w3.org/TR/webrtc/#dom-rtcicecandidate-sdpmlineindex :

> If not null, this indicates the index (starting at zero) of the media description in the SDP this candidate is associated with.

# Steps to reproduce

1. Open https://jeremija.github.io/safari-wrtc/
2. Grant Camera & Microphone access
3. Open Console log

## Expected results

Candidates for sdpMid `video` and `audio` should have a different `sdpMLineIndex`, e.g. `0` and `1`.

## Observed results

Candidates for sdpMid `video` and `audio` have the same `sdpMLineIndex`: `0`

# Example logs

Example is available here: https://jeremija.github.io/safari-wrtc/

## Chrome 59.0.3071.115:

```
createPeer MediaStream {...}
ok
index.js:23 icecandidate 0 audio
2index.js:23 icecandidate 1 video
2index.js:23 icecandidate 0 audio
index.js:23 icecandidate 1 video
```

## Firefox 54.0.1:

```
createPeer LocalMediaStream { id: "{cb44284c-3c57-6a48-a6a2-a351b65fde…", active: true, onaddtrack: null, currentTime: 0 }
addTrack AudioStreamTrack { kind: "audio", ...}
addTrack VideoStreamTrack { kind: "video", ...}
ok
icecandidate 0 sdparta_0
icecandidate 1 sdparta_1
icecandidate 0 sdparta_0
icecandidate 1 sdparta_1
```

## Safari Technology Preview Release 34 (Safari 11.0, WebKit 12604.1.27.0.1):

```
[Log] createPeer – MediaStream (index.js, line 7)
MediaStream
[Log] addTrack – MediaStreamTrack (index.js, line 14)
MediaStreamTrack
[Log] addTrack – MediaStreamTrack (index.js, line 14)
MediaStreamTrack
[Log] ok
[Log] icecandidate (2) (index.js, line 20)
0
"audio"
[Log] icecandidate (2) (index.js, line 20)
0
"video"
[Log] icecandidate (2) (index.js, line 20)
0
"audio"
[Log] icecandidate (2) (index.js, line 20)
0
"video"
```

Audio and video have the same `sdpMLineIndex`. Firefox will reject peer connection attempts from Safari with the following error:

> Mismatch between mid and level - "video" is not the mid level 0; "audio" is

# Workaround

The client can automatically keep track of iceCandidates and manually increase the counter as done here: https://github.com/jeremija/simple-peer/commit/3be31eac590a6e404685c6c2d86c457eebe7f2e9
