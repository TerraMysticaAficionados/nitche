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
    const [flipped, setFlipped] = useState(true)
    const [videoEnabled, setVideoEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    
    return <div id="mirror-root" style={{
        display: "flex",    //  flex-box is excellent for arranging pages. usually best when nested: a parent flex element to define boundery, child to be oriented within parent, then content within that. This allows content to be swapped out easily and the overall position on the page to be relatively stable. 
        
    }} >

        <div id="fullScreenVideoContainer" style={{
            position: "absolute",   //  position absolute is very useful and powerful, but generally should be avoided because it is not "responsive" which in web design terms means capable of displaying more or less correctly no matter what the device is. flexboxes on the other hand are a highly responsive technique that allows rules to be defined around the display of child elements, such that a horizontal list smoothly stacks its content as the window narrows. This is not always desirable, but is a reasonable default behavior.
            left:"0px",
            right:"0px"
        }}>
            <button onClick={() => {
                setFlipped(!flipped)
            }}>Flip</button>
            <button onClick={() => {
                setAudioEnabled(!audioEnabled)
            }}>{audioEnabled ? "mute audio" : "enable audio"}</button>
            <button onClick={() => {
                setVideoEnabled(!videoEnabled)
            }}>{videoEnabled ? "disable video" : "enable video"}</button>
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
                prefix: "webrtc-prototype"
            })
            videoElem.srcObject = localMediaStream
            return connectionClient.createConnection({
                beforeAnswer: (peerConnection:RTCPeerConnection) => {
                    localMediaStream.getTracks().forEach(track => {
                        peerConnection.addTrack(track, localMediaStream)
                    })
                    const {close} = peerConnection
                    peerConnection.close = () => {
                        localMediaStream.getTracks().forEach(track => {
                            track.stop()
                        })
                        return close()
                    }
                }
            })
        }).then((peerConnection) => {
            localPeerConnection.current = peerConnection
        })

        return () => {
            localPeerConnection?.current?.close()
            canceled = true
            videoElem.srcObject = null
        }
    }, [videoRef])

    return [stream]
}



