import { useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { WebRTCRecorder } from "@/lib/components/WebRTCRecorder";
import { randomUUID } from "crypto";

/**
 * webrtc/broadcaster.tsx
 * Preview for a user what they're camera is capturing.
 *
 */
export default () => {

    const { width, height } = useWindowSize()
    const [muted, setMuted] = useState(false)
    const [paused, setPaused] = useState(false)

    return <div className="videoContainer" style={{
        width: "1000px"
    }} >
        <div className="fullscreenVideoContainer" style={{
            display: "flex",
        }}>
            <WebRTCRecorder
                streamId="sandbox-stream-id"
                style={{
                    width:width,
                    maxHeight:height,
                }}
                muted={muted}
                paused={paused}
            />
        </div>
        <div className="videoControls" style={{
            display: "flex",
        }}>
            <button onClick={() => {
                setMuted(!muted)
            }}>{muted ? "unmute audio" : "unmute audio"}</button>
            <button onClick={() => {
                setPaused(!paused)
            }}>{paused ? "unpause video" : "pause video"}</button>
        </div>
    </div>
}

