import { useEffect, useRef, useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";
import WebSocketStream from "websocket-stream";
import ConnectionClient from "@/lib/common/ClientConnection";



/** 
 * mirror.tsx
 * Preview for a user what they're camera is capturing. 
 * 
 */
export default () => {

    const { width, height } = useWindowSize()
    const [flipped, setFlipped] = useState(false)
    const [videoEnabled, setVideoEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    
    return <div className="videoContainer" style={{
        display: "flex",
    }} >
        <div className="fullscreenVideoContainer" style={{
            position: "absolute",
            left:"0px",
            right:"0px"
        }}>
            <WebRTCPlayer 
                style={{
                    width:width, 
                    maxHeight:height, 
                    scale:flipped ? "-1 1" : "1 1"
                }}
                audio={audioEnabled}
                video={videoEnabled}
            />
        </div>
        <div className="videoControls">
            <button className="button" onClick={() => {
                setFlipped(!flipped)
            }}>Flip</button>
            <button onClick={() => {
                setAudioEnabled(!audioEnabled)
            }}>{audioEnabled ? "mute audio" : "enable audio"}</button>
            <button onClick={() => {
                setVideoEnabled(!videoEnabled)
            }}>{videoEnabled ? "disable video" : "enable video"}</button>
        </div>
    </div>
}

function WebRTCPlayer({style, audio, video}:any) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [localStream] = useMedia(videoRef, audio, video)
    return <video ref={videoRef} autoPlay={true} style={style} controls={true} muted={true}></video>
}

function useMedia(videoRef:any, audio:boolean, video:boolean) { 
    const localPeerConnection = useRef<RTCPeerConnection|null>(null)
    let [stream, setStream] = useState<MediaStream|null>(null)
    const constraints = {
        video,
        audio,
    };

    useEffect(() => {
        if(!stream) return
        stream?.getAudioTracks().forEach(track => {
            track.enabled = audio
        })
        stream?.getVideoTracks().forEach(track => {
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
            return connectionClient.createConnection({
                beforeAnswer: (peerConnection:RTCPeerConnection) => {
                    localMediaStream.getTracks().forEach(track => {
                        peerConnection.addTrack(track, localMediaStream)
                    })
                    const {close} = peerConnection
                }
            })
        }).then((peerConnection) => {
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



