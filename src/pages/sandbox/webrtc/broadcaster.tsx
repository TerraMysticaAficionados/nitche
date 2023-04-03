import { useEffect, useRef, useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";
import ConnectionClient from "@/lib/common/ClientConnection";
import { WebRTCRecorder } from "@/lib/components/WebRTCRecorder";


/** 
 * webrtc/broadcaster.tsx
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
            <WebRTCRecorder
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

