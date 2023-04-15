import { useEffect, useRef } from "react"
import ConnectionClient from "@/lib/common/ClientConnection"


export interface WebRTCVideoProps {
    style?: React.CSSProperties
    controls?: boolean
    muted?: boolean
    autoPlay?: boolean
    poster?: string
}

export const WebRTCVideo:React.FC<WebRTCVideoProps>  = ({
    style,
    controls = false,
    muted = true,
    autoPlay = true,
    poster = undefined,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    useWebRTCRef(videoRef)
    return <video   //  advantages/disadvantages with canvas
        ref={videoRef}
        controls={controls}
        muted={muted}
        autoPlay={autoPlay}
        poster={poster}
    />
}

/**
 * Attach a webrtc stream to an HTMLVideoElement
 * @param videoRef
 * @returns
 */
export function useWebRTCRef(videoRef:React.RefObject<HTMLVideoElement>) {
    const localPeerConnection = useRef<RTCPeerConnection|null>(null)
    useEffect(() => {
        if(videoRef.current == undefined) return
        const videoElem = videoRef.current
        const connectionClient = new ConnectionClient({
            host: "http://localhost:8080/",
            prefix: "webrtc-viewer"
        })
        let canceled = false
        connectionClient.createConnection({
            beforeAnswer: (peerConnection:RTCPeerConnection) => {
                const remoteStream = new MediaStream(peerConnection.getReceivers().map(receiver => receiver.track));
                videoElem.srcObject = remoteStream;
                peerConnection.addEventListener("connectionstatechange", () => {
                    if (peerConnection.connectionState == "closed") {
                        videoElem.srcObject = null
                    }
                })
            }
        }).then(peerConnection => {
            if(canceled) peerConnection.close()
            localPeerConnection.current = peerConnection || null
        }).catch(error => {
            localPeerConnection?.current?.close()
            console.log(error)
        })
        return () => {
            canceled = true
            localPeerConnection?.current?.close()
            videoElem.srcObject = null
        }
    }, [videoRef])
    return localPeerConnection
}

