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
    const [videoEnabled, setVideoEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    
    return <div className="videoContainer" style={{
        position: "absolute",
        left:"0px",
        right:"0px"
    }} >
        <div className="fullscreenVideoContainer" style={{
            display: "flex",
        }}>
            <WebRTCPlayer 
                style={{
                    width:width, 
                    maxHeight:height, 
                }}
                audio={audioEnabled}
                video={videoEnabled}
            />
        </div>
        <div className="videoControls" style={{
            display: "flex",
        }}>
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
    let stream = useRef<MediaStream|null>(null)
    const constraints = {
        video,
        audio,
    };

    console.log("av",audio,video)
    useEffect(() => {
        stream?.current?.getAudioTracks().forEach(track => {
            console.log("disabled audio")
            track.enabled = audio
        })
        stream?.current?.getVideoTracks().forEach(track => {
            console.log("disabled video")
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



