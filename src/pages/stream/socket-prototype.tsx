import { useEffect, useRef, useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";

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
        let canceled = false
        let [websocketPromise, websocketCleanup] = getWebsocketPromise(WEBSOCKET_URL)
        console.log("mounting", canceled)
        Promise.all([
            navigator.mediaDevices.getUserMedia(constraints),
            websocketPromise
        ]).then(([userMediaStream, websocket]) => {
            if(canceled) {
                websocketCleanup()
                return
            }
            if(websocket == null || videoElem == null || userMediaStream == null) return
            console.log("promise loaded", userMediaStream, websocket)
            //  set state, might have a better way to do this. this makes me nervous bc we avoid rerender only because stream is a nested obj, but we use this to modify recording attributes
            setStream(userMediaStream)
            //  set local video
            videoElem.srcObject = userMediaStream
            //  set websocket video
            videoElem.onloadedmetadata = (e:Event) => {
                console.log(videoElem)
            }

            console.log("support", MediaRecorder.isTypeSupported('video/webm;codecs=opus'))
            let options = {mimeType: 'video/webm;codecs=opus'};
            mediaRecorder = new MediaRecorder(userMediaStream,options);
            let i =0
            let chunks:Blob[] =  []
            mediaRecorder.ondataavailable = async (e) => {
                i ++
                websocket?.send(e.data)
            }
            mediaRecorder.onstop = () => {
                console.log("stop")
                const dataBlob = new Blob(chunks, { type: 'video/webm;codecs=opus'});
                const vidURL = window.URL.createObjectURL(dataBlob);
                videoElem.src = vidURL
                videoElem.srcObject = null
            }
            mediaRecorder.start(MEDIA_RECORDER_MS)

        })
        return () => {
            console.log("unmounting")
            canceled = true
            websocketCleanup()
        }
    }, [videoRef])

    return [stream]
}

/**
 * Create a promise that resolves with a websocket when connection is opened.
 * 
 * return the promise and a cleanup function
 * promise resolves to the websocket and open/error event (websocket is null on error)
 * 
 * @param url 
 * @returns [Promise<WebSocket|null>, Function]
 */
function getWebsocketPromise(url:string): [Promise<WebSocket|null>, Function]{
    let cleaned = false
    let websocketRef: WebSocket;
    let websocketPromise = new Promise<WebSocket|null>((resolve, reject) => {
        websocketRef = new WebSocket(url)
        websocketRef.addEventListener("open", (event) => {
            if(cleaned) resolve(null) //    if cleaned don't do anything
            console.log("ws open")
            resolve(websocketRef)
        })
        websocketRef.addEventListener("error", (event) => {
            if(cleaned) resolve(null) //  if cleaned don't do anything
            console.log("ws error")
            reject(null)
        })
        websocketRef.addEventListener("close", ( ) => {
            console.log("ws closed")
        })
    })
    function cleanupPromise () {
        console.log("ws cleanup")
        cleaned = true
        websocketRef.close()
    }
    console.log("getWebsocketPromise", websocketPromise)
    return [websocketPromise, cleanupPromise]
}

