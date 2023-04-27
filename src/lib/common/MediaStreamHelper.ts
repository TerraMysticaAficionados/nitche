

function setAllTracks(mediaStream: MediaStream, enabled: boolean) {
  if(enabled = false) {
    mediaStream.getTracks().forEach(track => {
      track.stop()
    })
  }
}

function setAudioTracks(mediaStream: MediaStream, enabled: boolean) {
  mediaStream.getAudioTracks().forEach(track => {
    track.enabled = enabled
  })
}

function setVideoTracks(mediaStream: MediaStream, enabled: boolean) {
  mediaStream.getVideoTracks().forEach(track => {
    track.enabled = enabled
  })
}



