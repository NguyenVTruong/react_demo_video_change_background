import { useRef, useEffect, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

export const useBodyPixPlugin = (videoRef: React.RefObject<HTMLVideoElement>, backgroundSrc: string) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<bodyPix.BodyPix | null>(null);
  const [background, setBackground] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const detectPerson = async () => {
      if (!videoRef.current) return;
  
      const model = await bodyPix.load();
      const segmentation = await model.segmentPerson(videoRef.current);
  
      console.log("👤 Kết quả nhận diện:", segmentation);
    };
  
    setTimeout(detectPerson, 5000); // Chờ 5s cho video load
  }, []);

  useEffect(() => {
    // navigator.mediaDevices.getUserMedia({ video: true })
    // .then(stream => {
    //   if (videoRef.current) {
    //     videoRef.current.srcObject = stream;
    //     console.log("🎥 Stream gán vào video:", stream);
    //   }
    // })
    // .catch(error => console.error("❌ Lỗi khi lấy camera:", error));

    const loadModel = async () => {
        const net = await bodyPix.load();
        setModel(net);
        console.log("🎥 Video ref:", videoRef.current);
      };
  
      loadModel();
//     const img = new Image();
//     img.src = backgroundSrc;
//     img.onload = () => setBackground(img);
//     console.log("📸 Background image URL:", backgroundSrc);


    
//     console.log(model, background);
//     if (!model || !background) return;
//     console.log(videoRef.current, canvasRef.current);

//     if (!videoRef.current || !canvasRef.current) return;
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     video.width = 640;
//     video.height = 480;
//     canvas.width = 640;
//     canvas.height = 480;

//     const processVideo = async () => {
//       if (!ctx || !model || !video) return;

//       const segmentation = await model.segmentPerson(video, {
//         internalResolution: "medium",
//         segmentationThreshold: 0.7,
//       });

//       const mask = bodyPix.toMask(segmentation);

//       ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
//       ctx.putImageData(mask, 0, 0);
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       requestAnimationFrame(processVideo);
//     };

//     processVideo();
  }, [model, background]);

  return { canvasRef };
};
