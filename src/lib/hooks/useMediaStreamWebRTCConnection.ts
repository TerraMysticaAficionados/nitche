import { useEffect, useRef } from "react"
import ConnectionClient from '@/lib/common/ConnectionClient'

export interface UseMediaStreamWebRTCConnectionProps {
    broadcastId: string,
    host?:string,
    prefix?: string,
    audioEnabled?: boolean
    videoEnabled?: boolean
    broadcasting?: boolean
    getMediaStream?: () => Promise<MediaStream|null|undefined>
    closeMediaStream?: (mediaStream: MediaStream) => Promise<boolean>|boolean
}

/**
 * Pass in media stream getter / constructor to have the stream piped to a WebRTC connection
 * by default the getUserMedia is used.
 * If you override this functionality, be sure to define the correct closeMediaStream function 
 * to deallocate the stream (if desired)
 * 
 * @returns 
 */
export function useMediaStreamWebRTCConnection({
    broadcastId,
    host = "http://localhost:8080/",
    prefix = "webrtc-broadcaster",
    audioEnabled = true,
    videoEnabled = true,
    broadcasting = false,
    getMediaStream = async () => {
        if(navigator.mediaDevices.getUserMedia == undefined) {
            alert('Your browser does not support getUserMedia API');
            return null
        }
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
    },
    closeMediaStream = (mediaStream) => {
        mediaStream.getTracks().forEach((track) => {
            track.stop()
        })
        return true
    }
}: UseMediaStreamWebRTCConnectionProps) {
    const localPeerConnection = useRef<RTCPeerConnection|null>(null)
    let mediaStream = useRef<MediaStream|null|undefined>(null)
    let cancelInProgressConnection = false
    console.log('UseMediaStreamWebRTCConnection')
    async function connectMediaStreamToWebRTC() {
        return getMediaStream().then((localMediaStream) => {
            if(localMediaStream == undefined) {
                return
            } else if(cancelInProgressConnection) {
                closeMediaStream(localMediaStream)
                return  //  canceled means this component is unmounted, stop any initialization
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
            if(cancelInProgressConnection) {
                peerConnection?.close()
                if(mediaStream.current != undefined) {
                    closeMediaStream(mediaStream.current)
                }
                return
            }
            localPeerConnection.current = peerConnection || null
        })
    }

    useEffect(() => {
        console.log("useEffect")
        if(!broadcasting) {
            console.log("useEffect destroy")
            localPeerConnection.current?.close()
            if(mediaStream.current) {
                closeMediaStream(mediaStream.current)
                mediaStream.current = null
            }
        } else {
            if(mediaStream.current == null) {
                console.log("useEffect init")
                connectMediaStreamToWebRTC()
            }
            mediaStream?.current?.getAudioTracks().forEach(track => {
                track.enabled = audioEnabled
            })
            mediaStream?.current?.getVideoTracks().forEach(track => {
                track.enabled = videoEnabled
            })
        }

        return () => {
            console.log("useEffect cleanup")
            localPeerConnection?.current?.close()
            if(mediaStream.current != undefined) {
                closeMediaStream(mediaStream.current)
            }
            cancelInProgressConnection = true
        }
    }, [audioEnabled, videoEnabled, broadcasting])

    // useEffect(() => {
    //     if(!getMediaStream || !closeMediaStream) {
    //         throw new Error("Cannot useMediaStreamWebRTCConnection without a media stream corresponding destructor function, see comments in useMediaStreamWebRTCConnection for usage instructions.")
    //     }
    //     connectMediaStreamToWebRTC()
    //     return () => {
    //         localPeerConnection?.current?.close()
    //         if(mediaStream.current != undefined) {
    //             closeMediaStream(mediaStream.current)
    //         }
    //         cancelInProgressConnection = true
    //     }
    // }, [])

    return {
        peerConnectionRef: localPeerConnection,
        mediaStreamRef: mediaStream,
    }
}