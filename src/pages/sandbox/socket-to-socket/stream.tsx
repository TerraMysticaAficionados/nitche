import { useEffect, useRef, useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";
import getWebsocketPromise from "@/lib/common/WebSocketPromise";

const STREAM_ID = "socket_prototype_test"
const MEDIA_RECORDER_MS = 1000
const WEBSOCKET_URL = "ws://localhost:8080/socket-prototype/" + STREAM_ID

/** 
 * socket-prototype.tsx
 *  1. initialize SocketPrototypeRecorder
 *  2. waits for 2 promises from websocket and getUserMedia then connects getUserMedia stream to video element and socket
 *  3. socket connection is via MediaRecorder API which recieves on ondataavailable every MEDIA_RECORDER_MS milliseconds
 */
export default () => {

    const { width, height } = useWindowSize()
    const [flipped, setFlipped] = useState(false)
    const [videoEnabled, setVideoEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)

    return <div id="mirror-root" style={{
        display: "flex",
    }} >
        <div id="fullScreenVideoContainer" style={{
            position: "absolute", 
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
            <SocketRecorderPrototype
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

function SocketRecorderPrototype({style, audio, video}:any) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [localStream] = useMedia(videoRef, audio, video)
    return <video ref={videoRef} autoPlay={true} style={style} controls={true} muted={true}></video>
}

function useMedia(videoRef:any, audio:boolean, video:boolean) { 
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
        let mediaRecorder:MediaRecorder;
        let canceled = false //  cleanup here is a little tricky, see returned function
        let [websocketPromise, websocketCleanup] = getWebsocketPromise(WEBSOCKET_URL)
        Promise.all([
            navigator.mediaDevices.getUserMedia(constraints),
            websocketPromise
        ]).then(([userMediaStream, websocket]) => {
            if(canceled) {
                websocketCleanup()
                return
            }
            if(websocket == null || videoElem == null || userMediaStream == null) return

            //  set state, might have a better way to do this. this makes me nervous bc we avoid rerender only because stream is a nested obj, but we use this to modify recording attributes
            setStream(userMediaStream)

            //  set local video
            videoElem.srcObject = userMediaStream

            //  set websocket video
            videoElem.onloadedmetadata = (e:Event) => {
                console.log(videoElem)
            }

            if(MediaRecorder.isTypeSupported('video/webm;codecs=opus')) {
                let options = {mimeType: 'video/webm;codecs=opus'};
                mediaRecorder = new MediaRecorder(userMediaStream,options);
                mediaRecorder.ondataavailable = async (e) => {
                    //  sending data chunk by chunk through websocket.
                    websocket?.send(e.data)
                }
                mediaRecorder.start(MEDIA_RECORDER_MS)
            } else {
                alert("Recording not supported by browser, cannot stream to server.")
            }

        })
        return () => {
            console.log("unmounting")
            //  canceled will allow us to handle promises in cleanup. 
            //  promises can resolve after component is unmounted, causing artifacts.
            //  if canceled = true, in promise handler, we don't run setup.
            canceled = true

            //  close websocket on unmount. 
            websocketCleanup()
        }
    }, [videoRef])

    return [stream]
}
