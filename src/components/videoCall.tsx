import { useVideoCallPlugin } from "./useVideoCallPlugin";
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';

const VideoCall = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

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
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.saokim.com.vn%2Fproject%2Fdu-an%2Fdesign-website-mobifone-public-cloud&psig=AOvVaw0ynDQUM559p2WBpVis5GTC&ust=1741876820575000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKC_4PvihIwDFQAAAAAdAAAAABAJ"
    );

    return (
        <div>
            <video ref={localVideoRef} autoPlay playsInline style={{ display: "none" }} />
            <video ref={remoteVideoRef} autoPlay playsInline />
            <audio ref={audioRef} autoPlay />
        </div>
    );
};

export default VideoCall;