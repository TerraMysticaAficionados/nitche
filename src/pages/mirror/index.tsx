import { useEffect, useRef, useState } from "react";
import useWindowSize from "@/lib/hooks/useWindowSize";

/**
 * mirror.tsx
 * Preview for a user what they're camera is capturing.
 *
 */

let peerConnection;
let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}

export default function Mirror(){

    const { width, height } = useWindowSize()
    const [flipped, setFlipped] = useState(true)


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
            <button onClick={() => {
                createOffer();
            }}>stream this shit</button>
            <WebRTCPlayer style={{width:width, maxHeight:height, scale:flipped ? "-1 1" : "1 1"}}/>
        </div>
    </div>
}

async function createOffer() {
    peerConnection = new RTCPeerConnection(servers);
    console.log(peerConnection);
    let remoteStream = new MediaStream();
    // const offer = await peerConnection.createOffer();
    // console.log(offer);
    // await peerConnection.setLocalDescription(offer);
    console.log(peerConnection);
}

function WebRTCPlayer(props:any) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream] = useMedia(videoRef)
    return <video id="vidPlayer" ref={videoRef} autoPlay={true} {...props}></video>
}

function useMedia(videoRef:any) {
    let [stream, setStream] = useState<any>(null)
    const constraints = {
        video: true,
        audio: true,
    };
    useEffect(() => {
        //  navigator.mediaDevices.getUserMedia for camera
        //  navigator.mediaDevices.getDisplayMedia for screenshare
        if(navigator.mediaDevices.getUserMedia == undefined) {
            alert('Your browser does not support getUserMedia API');
            return
        } else if (videoRef?.current == undefined) {
            return
        }
        const videoElem = videoRef?.current
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            if(videoElem != undefined) {
                console.log("setting stream", stream)
                setStream(stream)
                videoElem.srcObject = stream;
            }
        }).catch((err) => {
            console.log(err)
        });
    }, [videoRef])
    return [stream]
}


