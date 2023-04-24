import { useState } from "react";
import { useRouter } from "next/router";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { WebRTCBroadcaster } from "@/lib/components/WebRTCBroadcaster";

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

    return <div className="flex flex-col absolute left-0 right-0 top-0 bottom-0">
        <div className="flex flex-row justify-center">
            <div className="fullscreenVideoContainer flex">
                <div className="flex">
                    <WebRTCBroadcaster
                        broadcastId={router.query.broadcastId as string}
                        muted={muted}
                        paused={paused}
                    />
                </div>
            </div>
            <div className="flex flex-col">
                <button>End Broadcast</button>
                <button onClick={() => {
                    setPaused(!paused)
                }}>{paused ? "Start Video" : "Stop Video"}</button>
                <button onClick={() => {
                    setMuted(!muted)
                }}>{muted ? "Mute" : "Unmute"}</button>
            </div>
        </div>
    </div>
}

