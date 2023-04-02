import React, { useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { WebRTCVideo } from "@/lib/components/WebRTCVideo";


/** 
 * mirror.tsx
 * Preview for a user what they're camera is capturing. 
 * 
 */
export default () => {

    const { width, height } = useWindowSize()
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
                setAudioEnabled(!audioEnabled)
            }}>{audioEnabled ? "mute audio" : "enable audio"}</button>
            <button onClick={() => {
                setVideoEnabled(!videoEnabled)
            }}>{videoEnabled ? "disable video" : "enable video"}</button>
                <WebRTCVideo style={{width:width, maxHeight:height}} autoPlay={true /* passing props to video*/}/> 
        </div>
    </div>
}

// export interface WebRTCVideoProps {
//     style?: CSSProperties
//     controls?: boolean
//     muted?: boolean
//     autoPlay?: boolean
//     poster?: string
// }

// const WebRTCVideo:React.FC<WebRTCVideoProps>  = ({
//     style,
//     controls = true,
//     muted = true,
//     autoPlay = true,
//     poster = undefined,
// }) => {
//     const videoRef = useRef<HTMLVideoElement>(null)
//     useWebRTCRef(videoRef)
//     return <video   //  advantages/disadvantages with canvas
//         ref={videoRef} 
//         style={style} 
//         controls={controls} 
//         muted={muted} 
//         autoPlay={autoPlay}
//         poster={poster}
//     />
// }

// /**
//  * Attach a webrtc stream to an HTMLVideoElement
//  * @param videoRef 
//  * @returns 
//  */
// export function useWebRTCRef(videoRef:RefObject<HTMLVideoElement>) { 
//     const localPeerConnection = useRef<RTCPeerConnection|null>(null)
//     useEffect(() => {
//         if(videoRef.current == undefined) return
//         const videoElem = videoRef.current

//         const connectionClient = new ConnectionClient({
//             host: "http://localhost:8080/",
//             prefix: "webrtc-viewer"
//         })
//         let canceled = false
//         connectionClient.createConnection({
//             beforeAnswer: (peerConnection:RTCPeerConnection) => {
//                 const remoteStream = new MediaStream(peerConnection.getReceivers().map(receiver => receiver.track));
//                 videoElem.srcObject = remoteStream;
//                 peerConnection.addEventListener("connectionstatechange", () => {
//                     if (peerConnection.connectionState == "closed") {
//                         videoElem.srcObject = null
//                     } 
//                 })
//             }
//         }).then(peerConnection => {
//             if(canceled) peerConnection.close()
//             localPeerConnection.current = peerConnection || null
//         }).catch(error => {
//             localPeerConnection?.current?.close()
//             console.log(error)
//         }) 
//         return () => {
//             canceled = true
//             localPeerConnection?.current?.close()
//             videoElem.srcObject = null
//         }
//     }, [videoRef])
//     return localPeerConnection
// }



