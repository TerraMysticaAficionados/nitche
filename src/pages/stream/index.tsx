import { useEffect, useRef, useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";
import WebSocketStream from "websocket-stream";

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
        let [websocketPromise, websocketCleanup] = getWebsocketPromise("ws://localhost:8080/stream/123")
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
            //  set state, might have a better way to do this. this makes me nervous bc we avoid rerender only because stream is a nested obj
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
                // if(i > 4) {
                    // if(mediaRecorder.state == "recording") {
                    //     mediaRecorder.stop()
                    // } else {
                    //     return
                    // }
                // }


                // console.log(mediaRecorder)
                // let data = await e.data.arrayBuffer()
                // console.log(data)
                websocket?.send(e.data)
                // chunks.push(e.data)
            }
            mediaRecorder.onstop = () => {
                console.log("stop")
                const dataBlob = new Blob(chunks, { type: 'video/webm;codecs=opus'});
                const vidURL = window.URL.createObjectURL(dataBlob);
                videoElem.src = vidURL
                videoElem.srcObject = null

                // websocket.send(blob)
            }
            mediaRecorder.start(1000)






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

async function useWebsocket(url: string) {
    let resolveWebsocket: (value: unknown) => void;
    let rejectWebsocket: (reason?: any) => void;
    const websocketPromise = new Promise((resolve, reject) => {
        resolveWebsocket = resolve
        rejectWebsocket = reject
    })
    let [websocket, setWebsocket] = useState<WebSocket>()

    useEffect(() => {
        const websocketTemp = new WebSocket(url)
        setWebsocket(websocketTemp)
        // websocket.addEventListener("error", (event) => {
        //     console.log("error!", event)
        //     return rejectWebsocket(event)
        // })
        // websocket.addEventListener("open", () => {
        //     return resolveWebsocket(websocket)
        // })
        // return () => {
        //     websocket.close()
        // }
    }, [])

    return websocket
}


async function* streamIter(stream: MediaStream) {
    const mediaRecorder = new MediaRecorder(stream);
    let blobs: Blob[] = []
    let done = false
    mediaRecorder.ondataavailable = (e) => {
         blobs.push(e.data)
         if(e.data == null) {
            done = true
         }
    }
    mediaRecorder.start(1000)
    while(blobs.length > 0 || !done) {
        yield blobs.pop()
    }
    return null
}




