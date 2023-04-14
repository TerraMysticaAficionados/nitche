import { useEffect, useRef } from "react";
import shaka from 'shaka-player/dist/shaka-player.ui.js'

const STREAM_ID = "socket_prototype_test"
const manifestUri = "http://localhost:8080/recordings/" + STREAM_ID + "/manifest.mpd"

// shaka player docs
//  https://shaka-player-demo.appspot.com/docs/api/tutorial-basic-usage.html
export default function Player() {
    const videoContainerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if(!videoRef.current || !videoContainerRef.current) return
        var player = new shaka.Player(videoRef.current);
        player.addEventListener('error', (error:any) => {
            console.log(error)
        });
        player.load(manifestUri);
        const ui = new shaka.ui.Overlay(player, videoContainerRef.current, videoRef.current);
        const controls = ui.getControls();
        
        player.configure({});
        return () => {
            ui.destroy()
            player.destroy()
        }
    }, [])

    return <>
        <div ref={videoContainerRef} style={{
            "display":"flex",
            "width": "800px"
        }}>
        <video id="video" ref={videoRef} controls={true} autoPlay={true}></video>
        </div>
    </>
}