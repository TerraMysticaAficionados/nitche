import { useState } from "react";
import { useRouter } from "next/router";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { WebRTCRecorder } from "@/lib/components/WebRTCRecorder";
import { v4 as uuidv4 } from "uuid";
/**
 * webrtc/broadcaster.tsx
 * Preview for a user what they're camera is capturing.
 *
 */
export default () => {

    const router = useRouter()
    const { width, height } = useWindowSize()
    const [muted, setMuted] = useState(true)
    const [paused, setPaused] = useState(false)
    if(router.query.broadcastId == null) {
        return <div></div>
    }
    console.log(router.query.broadcastId)

    return <div className="videoContainer" style={{
        width: "1000px"
    }} >
        <div className="fullscreenVideoContainer" style={{
            display: "flex",
        }}>
            <WebRTCRecorder
                broadcastId={router.query.broadcastId as string}
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

