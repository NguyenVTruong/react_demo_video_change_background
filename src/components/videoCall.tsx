import { useVideoCallPlugin } from "./useVideoCallPlugin";
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import backgroundImg from "../assets/images/pexels-photo-1563356.jpeg";

const VideoCall = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 },
                });

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startCamera();
    }, []);
    const hangupByApp = () => {
        // console.log('FFFFFFFFFFFFFF');
        // let videoElement = document.getElementById('localVideo');
        // // @ts-ignore
        // let localstream = videoElement.srcObject;
        //
        // localstream?.getTracks().forEach(track => {
        //     track.stop();
        // });
    };
    // @ts-ignore
    useVideoCallPlugin(
        localVideoRef as RefObject<HTMLVideoElement>,
        remoteVideoRef as RefObject<HTMLVideoElement>,
        audioRef as RefObject<HTMLVideoElement>,
        hangupByApp,
        backgroundImg
    );

    return (
        <div>
            <video ref={localVideoRef} autoPlay playsInline style={{ display: "none",  width: "15%", height: "auto" }} />
            <video ref={remoteVideoRef} autoPlay playsInline style={{ display: "none" }} />
            <audio ref={audioRef} autoPlay />
            <canvas ref={canvasRef} style={{ width: "15%", height: "auto" }} />
        </div>
    );
};

export default VideoCall;
