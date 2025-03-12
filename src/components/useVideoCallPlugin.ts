import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';


// @ts-ignore
export function useVideoCallPlugin(
    localVideoRef: RefObject<HTMLVideoElement>,
    remoteVideoRef: RefObject<HTMLVideoElement>,
    audioRef: RefObject<HTMLAudioElement>,
    hangupByApp: () => void,
    backgroundImg: string // Hình nền mới
) {
    const [onOffRecordVideoCall, setOnOffRecordVideoCall] = useState(false);

    useEffect(() => {
        const setupVideoCall = async () => {
            await checkPermission(); // Kiểm tra quyền truy cập camera/mic
            // await getConfigRecordVideoCall(); // Lấy cấu hình ghi hình

            // Nếu quay video call được bật, thì xóa phông nền
            if (onOffRecordVideoCall && localVideoRef.current) {
                await applyBackgroundEffect(localVideoRef.current, backgroundImg);
            }
        };

        setupVideoCall();

        return () => {
            if (localVideoRef.current?.srcObject) {
                (localVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
            }
            hangupByApp();
        };
    }, [onOffRecordVideoCall, backgroundImg]);

    // Hàm lấy cấu hình bật/tắt quay video từ API
    // const getConfigRecordVideoCall = async () => {
    //     try {
    //         const result = await configurationService.getConstantStringValues({ key: "app.recordVideoCall" });
    //         if (result && result.length > 0) {
    //             const [configOnOffVideoCall] = result;
    //             setOnOffRecordVideoCall(configOnOffVideoCall === "1");
    //         }
    //     } catch (error) {
    //         console.log("Lỗi khi lấy cấu hình quay video:", error);
    //     }
    // };

    // Hàm xóa phông nền bằng BodyPix
    const applyBackgroundEffect = async (videoElement: HTMLVideoElement, bgImage: string) => {
        const net = await bodyPix.load(); // Load mô hình BodyPix
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        document.body.appendChild(canvas); // Hoặc gắn canvas vào nơi phù hợp

        const bg = new Image();
        bg.src = bgImage;
        bg.onload = () => processFrame();

        const processFrame = async () => {
            if (!videoElement || !ctx) return;
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;

            const segmentation = await net.segmentPerson(videoElement, {
                internalResolution: "low",
                segmentationThreshold: 0.7,
            });

            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            const mask = bodyPix.toMask(segmentation);

            ctx.putImageData(mask, 0, 0);
            ctx.globalCompositeOperation = "source-in";
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";

            requestAnimationFrame(processFrame);
        };
    };

    // Giả lập hàm kiểm tra quyền
    const checkPermission = async () => {
        console.log("Kiểm tra quyền truy cập camera...");
        return true;
    };
}
