import { useEffect, useRef } from "react"
import ConnectionClient from "@/lib/common/ClientConnection"

export function WebRTCRecorder({style, audio, video}:any) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [localStream] = useMedia(videoRef, audio, video)
    return <video ref={videoRef} autoPlay={true} style={style} controls={true} muted={true}></video>
}

export function useMedia(videoRef:any, audio:boolean, video:boolean) {
    const localPeerConnection = useRef<RTCPeerConnection|null>(null)
    let stream = useRef<MediaStream|null>(null)
    const constraints = {
        video: {
            aspectRatio: 16/9,
            facingMode: 'user',
        },
        audio,
    };

    useEffect(() => {
        stream?.current?.getAudioTracks().forEach(track => {
            track.enabled = audio
        })
        stream?.current?.getVideoTracks().forEach(track => {
            track.enabled = video
        })
    }, [audio, video])

    useEffect(() => {
        if(navigator.mediaDevices.getUserMedia == undefined) {
            alert('Your browser does not support getUserMedia API');
            return
        } else if (videoRef?.current == undefined) {
            return
        }
        const videoElem = videoRef?.current
        let canceled = false
        navigator.mediaDevices.getUserMedia(constraints).then((localMediaStream) => {
            if(canceled) {
                return
            }
            const connectionClient = new ConnectionClient({
                host: "http://localhost:8080/",
                prefix: "webrtc-broadcaster"
            })
            videoElem.srcObject = localMediaStream
            stream.current = localMediaStream
            return connectionClient.createConnection({
                beforeAnswer: (peerConnection:RTCPeerConnection) => {
                    localMediaStream.getTracks().forEach(track => {
                        peerConnection.addTrack(track, localMediaStream)
                    })
                }
            })
        }).then((peerConnection) => {
            if(canceled) {
                peerConnection?.close()
                return
            }
            localPeerConnection.current = peerConnection || null
        })

        return () => {
            localPeerConnection?.current?.close()
            canceled = true
            videoElem.srcObject = null
        }
    }, [videoRef])

    return [stream]
}