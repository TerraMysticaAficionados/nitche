import { useEffect, useRef, useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";
import getWebsocketPromise from "@/lib/common/WebSocketPromise";

/** 
 * Consuming a stream from a websocket using ws-streaming
 */
export default () => {

    const { width, height } = useWindowSize()
    const [flipped, setFlipped] = useState(false)

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
            <SocketRecorder style={{width:width, maxHeight:height, scale:flipped ? "-1 1" : "1 1"}} controls={true}/>
        </div>
    </div>
}

function SocketRecorder(props:any) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream] = useMedia(videoRef)
    return <video ref={videoRef} autoPlay={true} {...props}></video>
}

function useMedia(videoRef:any) { 
    let [stream, setStream] = useState<any>(null)
    const constraints = {
        video: true,
        audio: true,
    };
    useEffect(() => {
        if(navigator.mediaDevices.getUserMedia == undefined) {
            alert('Your browser does not support getUserMedia API');
            return
        } else if (videoRef?.current == undefined) {
            return
        }

        if(process.env.NEXT_PUBLIC_NITCHE_SERVER_WS_URL == undefined) {
            alert("Streaming server not available")
            return 
        }
        const videoElem = videoRef?.current
        const [websocketPromise, cleanupWebsocketPromise] = getWebsocketPromise(process.env.NEXT_PUBLIC_NITCHE_SERVER_WS_URL)

        Promise.all([
            websocketPromise,
            navigator.mediaDevices.getUserMedia(constraints)
        ]).then(([websocket, mediaStream]) => {
            if(websocket == null || mediaStream == null) {
                return null
            } else if (videoElem?.current == undefined) {
                return null
            }

            setStream(mediaStream)
            videoElem.srcObject = mediaStream;

        }).catch((err) => {
            console.log(err)
        });
        return () => {
            cleanupWebsocketPromise()
        }
    }, [videoRef])

    return [stream]
}


