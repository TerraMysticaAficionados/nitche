import { useState } from "react";
import { useRouter } from "next/router";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { WebRTCBroadcaster } from "@/lib/components/WebRTCBroadcaster";
import { BroadcastShare } from "@/lib/components/BroadcastShare";
import {FaVolumeMute, FaVolumeUp, FaVideoSlash, FaVideo} from "react-icons/fa"

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
    if(typeof(router.query.broadcastId) != 'string') {
        return <div></div>
    }

    return <div className="flex flex-col absolute left-0 right-0 top-0 bottom-0">
        <div className="flex flex-row justify-center">
            <div className="fullscreenVideoContainer flex flex-col">
                <div className="flex self-center">
                    <BroadcastShare broadcastName={router.query.broadcastId}/>
                </div>
                <div className="flex">
                    <WebRTCBroadcaster
                        broadcastId={router.query.broadcastId as string}
                        muted={muted}
                        paused={paused}
                    />
                </div>
                <div className="flex justify-between py-2">
                    <div>
                        <button className="px-2" onClick={() => {
                            setPaused(!paused)
                        }}>{paused ? <FaVideoSlash /> : <FaVideo />}</button>
                        <button className="px-2" onClick={() => {
                            setMuted(!muted)
                        }}>{muted ? <FaVolumeMute /> : <FaVolumeUp />}</button>
                    </div>
                    <div className="relative px-2 items-center border border-red-600 rounded-md cursor-pointer" onClick={async () => {
                        const result = await confirm("End Broadcast?")
                    }}>
                        <button className="mx-2 bg-red-600 rounded-full h-4 w-4 border-red-200 border-2 border-double"></button>
                        BROADCASTING
                    </div>
                </div>
            </div>
            {/* Gutter Right */}
            <div className="flex flex-col">
            </div>
        </div>
    </div>
}

