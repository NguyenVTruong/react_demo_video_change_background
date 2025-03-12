import { useRef } from "react";
import { useBodyPixPlugin } from "././useVideoCallPlugin";

const VideoCall = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { canvasRef } = useBodyPixPlugin(videoRef as React.RefObject<HTMLVideoElement>, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN_Dap1JjDe2mQpi2FeEfC-pIXJmRbpYHmug&s");

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: "640px", height: "480px" }} />
      {/* <canvas ref={canvasRef} style={{ display: "none" }} /> */}

    </div>
  );
};

export default VideoCall;
