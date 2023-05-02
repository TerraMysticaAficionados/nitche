import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { WebRTCBroadcaster } from "@/lib/components/WebRTCBroadcaster";
import { BroadcastShare } from "@/lib/components/BroadcastShare";
import { BroadcastButton } from "@/lib/components/BroadcastingButton";
import {FaVolumeMute, FaVolumeUp, FaVideoSlash, FaVideo} from "react-icons/fa"
import { NitcheServerApi } from "@/lib/common/NitcheServerApi";

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
    const [broadcasting, setBroadcasting] = useState(false)
    const [canBroadcast, setCanBroadcast] = useState(false)

    useEffect(() => {
        let canceled = false
        NitcheServerApi.getBroadcastList().then(data => {
            if(canceled) return false
            for(const existingBroacast of data) {
                if(existingBroacast == router.query.broadcastId) {
                    setCanBroadcast(false)
                    return false
                }
            }
            setCanBroadcast(true)
        })
        return () => {
            canceled = true
        }
    }, [router.query.broadcastId])

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
                        broadcasting={broadcasting}
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
                    {canBroadcast ? <BroadcastButton 
                        initialBroadcastingState={broadcasting} 
                        onEndBroadcastConfirm={() => {
                            setBroadcasting(false)
                        }}
                        onStartBroadcastConfirm={() => {
                            setBroadcasting(true)
                        }}
                    /> : "Cannot broadcast"}
                </div>
            </div>
            {/* Gutter Right */}
            <div className="flex flex-col">
            </div>
        </div>
    </div>
}

