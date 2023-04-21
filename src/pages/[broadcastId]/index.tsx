import React, { useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { WebRTCVideo } from "@/lib/components/WebRTCVideo";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

/** 
 * sandbox/webrtc/viewer.tsx
 * Example of connecting to a WebRTC Stream
 */
export default () => {
  const router = useRouter()
  const { width, height } = useWindowSize()
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  if(router.query.broadcastId == null) {
      return <div></div>
  }
  console.log(router.query.broadcastId)

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
        <WebRTCVideo 
          broadcastId={router.query.broadcastId as string}
          style={{width:width, maxHeight:height}}
          autoPlay={true}
          muted={true}
        /> 
    </div>
  </div>
}
