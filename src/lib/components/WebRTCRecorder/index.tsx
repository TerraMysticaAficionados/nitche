import { useRef } from "react"
import { useMediaStreamWebRTCConnection } from "@/lib/hooks/useMediaStreamWebRTCConnection"

export interface WebRTCRecorderProps {
    broadcastId: string,
    style: React.CSSProperties
    controls?: boolean
    muted?: boolean
    paused?: boolean,
    autoPlay?: boolean
}

export const WebRTCRecorder: React.FC<WebRTCRecorderProps> = ({
    broadcastId,
    style,
    muted = true,
    controls = true,
    autoPlay = true,
    paused = false  //  pauses audio + video
}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    useMediaStreamWebRTCConnection({
        broadcastId,
        audioEnabled: !muted && !paused,
        videoEnabled: !paused,
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
