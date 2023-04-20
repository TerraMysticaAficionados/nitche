import { useEffect, useRef } from "react"
import ConnectionClient from '@/lib/common/ConnectionClient'

export interface UseMediaStreamWebRTCConnectionProps {
    broadcastId: string,
    host?:string,
    prefix?: string,
    audioEnabled?: boolean
    videoEnabled?: boolean
    getMediaStream?: () => Promise<MediaStream|null|undefined>
}

export function useMediaStreamWebRTCConnection({
    broadcastId,
    host = "http://localhost:8080/",
    prefix = "webrtc-broadcaster",
    audioEnabled = true,
    videoEnabled = true,
    getMediaStream = async () => {
        if(navigator.mediaDevices.getUserMedia == undefined) {
            alert('Your browser does not support getUserMedia API');
            return null
        }
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
    }
}: UseMediaStreamWebRTCConnectionProps) {
    const localPeerConnection = useRef<RTCPeerConnection|null>(null)
    let mediaStream = useRef<MediaStream|null|undefined>(null)

    useEffect(() => {
        mediaStream?.current?.getAudioTracks().forEach(track => {
            track.enabled = audioEnabled
        })
        mediaStream?.current?.getVideoTracks().forEach(track => {
            track.enabled = videoEnabled
        })
    }, [audioEnabled, videoEnabled])

    useEffect(() => {
        let canceled = false
        getMediaStream().then((localMediaStream) => {
            if(canceled) {
                return  //  canceled means this component is unmounted, stop any initialization
            } else if (localMediaStream == null) {
                return
            }
            const connectionClient = new ConnectionClient({host, prefix, params: {
                broadcastId, 
                broadcaster: true
            }})
            mediaStream.current = localMediaStream
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
        }
    }, [])

    return {
        peerConnectionRef: localPeerConnection,
        mediaStreamRef: mediaStream,
    }
}