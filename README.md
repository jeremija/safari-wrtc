# Safari Technology Preview Release 34 Bug Report

During the WRTC peer connection negotiation, onicecandidate callback will
return a candidate object with `sdpMLineIndex` always set to `0`, which makes
it impossible to initiate peer connections with more than one stream with other
clients in Firefox or Chrome (haven't tested Safari to Safari connection).

From the spec https://www.w3.org/TR/webrtc/#dom-rtcicecandidate-sdpmlineindex :

> If not null, this indicates the index (starting at zero) of the media
> description in the SDP this candidate is associated with.

# Steps to reproduce

1. Open https://jeremija.github.io/safari-wrtc/
2. Grant Camera & Microphone access
3. Open Console log

## Expected results

Candidates for sdpMid `video` and `audio` should have a different
`sdpMLineIndex`, e.g. `0` and `1`.

## Observed results

Candidates for sdpMid `video` and `audio` have the same `sdpMLineIndex`: `0`

# Example logs

Example is available here: https://jeremija.github.io/safari-wrtc/

## Chrome 59.0.3071.115:

```
createPeer MediaStream
ok
icecandidate 0 audio
icecandidate 1 video
icecandidate 0 audio
icecandidate 1 video
```

## Firefox 54.0.1:

```
createPeer LocalMediaStream {...}
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
createPeer MediaStream
MediaStream
addTrack MediaStreamTrack
addTrack MediaStreamTrack
ok
icecandidate (2) 0 "audio"
icecandidate (2) 0 "video"
icecandidate (2) 0 "audio"
icecandidate (2) 0 "video"
```

Audio and video have the same `sdpMLineIndex`. Firefox will reject peer
connection attempts from Safari with the following error:

> Mismatch between mid and level - "video" is not the mid level 0; "audio" is

# Workaround

The client can automatically keep track of iceCandidates and manually increase
the counter as done in [jeremija/simple-peer@`3be31eac`][1].

[1]: https://github.com/jeremija/simple-peer/commit/3be31eac590a6e404685c6c2d86c457eebe7f2e9
