import React, { useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { WebRTCVideo } from "@/lib/components/WebRTCVideo";


/** 
 * sandbox/webrtc/viewer.tsx
 * Example of connecting to a WebRTC Stream
 */
export default () => {

    const { width, height } = useWindowSize()
    const [videoEnabled, setVideoEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    
    return <div id="mirror-root" style={{display: "flex"}} >
        <div id="fullScreenVideoContainer" style={{
            position: "absolute",
            left:"0px",
            right:"0px"
        }}>
            <button onClick={() => {
                setAudioEnabled(!audioEnabled)
            }}>{audioEnabled ? "mute audio" : "enable audio"}</button>
            <button onClick={() => {
                setVideoEnabled(!videoEnabled)
            }}>{videoEnabled ? "disable video" : "enable video"}</button>
                <WebRTCVideo style={{width:width, maxHeight:height}} autoPlay={true}/> 
        </div>
    </div>
}
