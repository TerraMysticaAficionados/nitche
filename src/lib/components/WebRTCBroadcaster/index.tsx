import { useRef } from "react"
import { useMediaStreamWebRTCConnection } from "@/lib/hooks/useMediaStreamWebRTCConnection"

export interface WebRTCBroadcasterProps {
    broadcastId: string,
    style?: React.CSSProperties
    controls?: boolean
    muted?: boolean
    paused?: boolean,
    autoPlay?: boolean,
    broadcasting?: boolean
}

export const WebRTCBroadcaster: React.FC<WebRTCBroadcasterProps> = ({
    broadcastId,
    style,
    muted = true,
    controls = false,
    autoPlay = true,
    paused = false,  //  pauses audio + video
    broadcasting=false,    //  if true, not broadcasting
}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    useMediaStreamWebRTCConnection({
        broadcastId,
        audioEnabled: !muted && !paused,
        videoEnabled: !paused,
        broadcasting,
        getMediaStream: async () => {
            if(navigator.mediaDevices.getUserMedia == undefined) {
                alert('Your browser does not support getUserMedia API');
                return null
            }
            return navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            }).then(mediaStream => {
                if(videoRef?.current != undefined){
                    videoRef.current.srcObject = mediaStream
                }
                return mediaStream
            })
        }
    })
    return <video ref={videoRef} autoPlay={autoPlay} style={style} controls={controls} muted={muted} />
}
