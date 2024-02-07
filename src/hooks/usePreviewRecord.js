import { useState, useRef, useEffect } from "react";
import useShowToast from "./useShowToast";

const usePreviewRecord = () => {
    const showToast = useShowToast();

    const mimeType = "video/webm";
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const liveVideoFeed = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [videoChunks, setVideoChunks] = useState([]);
    const [recordedVideo, setRecordedVideo] = useState(null);

    console.log(permission)
    const getCameraPermission = async () => {
        try {
            const videoConstraints = {
                audio: false,
                video: true,
            };
            const audioConstraints = { audio: true };
            // create audio and video streams separately
            const audioStream = await navigator.mediaDevices.getUserMedia(
                audioConstraints
            );
            const videoStream = await navigator.mediaDevices.getUserMedia(
                videoConstraints
            );
            setPermission(true);
            // combine both audio and video streams
            const combinedStream = new MediaStream([
                ...videoStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);
            console.log(combinedStream)
            setStream(combinedStream);
            // set video stream to live feed player
            liveVideoFeed.current.srcObject = videoStream;

            console.log(liveVideoFeed)
        } catch (err) {
            showToast("Error", err.message, "error");
        }
    };
    const startRecording = () => {
        if (!stream) {
            console.error("No stream available to start recording.");
            return;
        }
        setRecordingStatus("recording");
        try {
            const media = new MediaRecorder(stream, { mimeType });
            mediaRecorder.current = media;
            mediaRecorder.current.start();
            let localVideoChunks = [];
            mediaRecorder.current.ondataavailable = (event) => {
                if (typeof event.data === "undefined") return;
                if (event.data.size === 0) return;
                localVideoChunks.push(event.data);
            };
            setVideoChunks(localVideoChunks);
        } catch (error) {
            console.error("Failed to start recording:", error);
        }
    };
    

    // const startRecording = () => {
    //     setRecordingStatus("recording");
    //     const media = new MediaRecorder(stream, { mimeType });
    //     mediaRecorder.current = media;
    //     mediaRecorder.current.start();
    //     let localVideoChunks = [];
    //     mediaRecorder.current.ondataavailable = (event) => {
    //         if (typeof event.data === "undefined") return;
    //         if (event.data.size === 0) return;
    //         localVideoChunks.push(event.data);
    //     };
    //     setVideoChunks(localVideoChunks);
    // };

    // const stopRecording = () => {
    //     setPermission(false);
    //     setRecordingStatus("inactive");
    //     mediaRecorder.current.stop();
    //     mediaRecorder.current.onstop = () => {
    //         const videoBlob = new Blob(videoChunks, { type: mimeType });
    //         const videoUrl = URL.createObjectURL(videoBlob);
    //         setRecordedVideo(videoUrl);
    //         setVideoChunks([]);
    //     };
    // };

    const stopRecording = () => {
        setPermission(false);
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const videoBlob = new Blob(videoChunks, { type: mimeType });
            const reader = new FileReader();
            reader.readAsDataURL(videoBlob);
            reader.onloadend = () => {
                const dataUrl = reader.result;
                setRecordedVideo(dataUrl);
                setVideoChunks([]);
            };
        };
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return { getCameraPermission, startRecording, stopRecording, recordedVideo };
};




export default usePreviewRecord;


