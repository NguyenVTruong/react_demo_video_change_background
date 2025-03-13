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
            await getConfigRecordVideoCall(); // Lấy cấu hình ghi hình

            // Nếu quay video call được bật, thì xóa phông nền
            localVideoRef.current.onloadedmetadata = async () => {
                console.log("Video metadata loaded");
                await applyBackgroundEffect(localVideoRef.current, backgroundImg);
            };
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
    const getConfigRecordVideoCall = async () => {
        try {
            // const result = await configurationService.getConstantStringValues({ key: "app.recordVideoCall" });
            // if (result && result.length > 0) {
            //     const [configOnOffVideoCall] = result;
                setOnOffRecordVideoCall(true);
            // }
        } catch (error) {
            console.log("Lỗi khi lấy cấu hình quay video:", error);
        }
    };

    // Hàm xóa phông nền bằng BodyPix
    const applyBackgroundEffect = async (videoElement: HTMLVideoElement, bgImage: string) => {
        const net = await bodyPix.load(); // Load mô hình BodyPix
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            console.error("Không thể lấy context từ canvas");
            return;
        }

        document.body.appendChild(canvas); // Gắn canvas vào trang web để debug (có thể ẩn sau)

        // Tạo ảnh nền
        const bg = new Image();
        bg.src = bgImage;

        bg.onload = () => {
            console.log("Ảnh nền đã load");
            processFrame();
        };

        const processFrame = async () => {
            if (!videoElement || !net || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
                requestAnimationFrame(processFrame);
                return;
            }
            // Cập nhật kích thước canvas theo video
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;

            const segmentation = await net.segmentPerson(videoElement, {
                internalResolution: "low",
                segmentationThreshold: 0.5,
            });

            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            const mask = bodyPix.toMask(segmentation);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixelData = imageData.data;
            const maskData = mask.data;

            for (let i = 0; i < pixelData.length; i += 4) {
                let alpha = maskData[i + 3]; // Lấy kênh alpha của mask
                if (alpha < 200) {  // Nếu pixel gần như không trong suốt (thuộc về người)
                    pixelData[i + 3] = 0; // Làm pixel này trong suốt
                }
            }
            ctx.putImageData(imageData, 0, 0); // Xóa người khỏi nền

            ctx.globalCompositeOperation = "destination-over";
            ctx.drawImage(videoElement, 0, 0); // Đảm bảo video không bị mất
            // // 🔴 3. Vẽ NGƯỜI LÊN TRÊN
            // ctx.globalCompositeOperation = "source-in";
            // ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";

            requestAnimationFrame(processFrame);
        };

        console.log("Chạy hiệu ứng nền...");
    };


    // Giả lập hàm kiểm tra quyền
    const checkPermission = async () => {
        console.log("Kiểm tra quyền truy cập camera...");
        return true;
    };
}
