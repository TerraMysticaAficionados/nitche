import { useEffect, useRef, useState } from "react";
import {v4 as uuid} from "uuid"

export default () => {


    return <div>
        <WebRTCPlayer />
    </div>
}

function WebRTCPlayer() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream] = useMedia(videoRef)
    return <video ref={videoRef} autoPlay={true} ></video>
}

function useMedia(videoRef:any) { 
    let [stream, setStream] = useState<any>(null)
    const constraints = {
        video: true,
        audio: true,
    };
    useEffect(() => {
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


