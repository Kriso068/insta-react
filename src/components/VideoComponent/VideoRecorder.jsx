
import { Box, Button, Flex } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

const VideoRecorder = ({ onRecordingComplete }) => {
    const mimeType = "video/webm"; // Change to "video/mp4" for iOS Safari
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const liveVideoFeed = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [videoChunks, setVideoChunks] = useState([]);
    const [recordedVideo, setRecordedVideo] = useState(null);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    const getCameraPermission = async () => {
        setRecordedVideo(null);
        if (!navigator.mediaDevices || !window.MediaRecorder) {
            alert("Your browser does not support video recording.");
            return;
        }

        try {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setPermission(true);
            setStream(videoStream);
            if (liveVideoFeed.current) {
                liveVideoFeed.current.srcObject = videoStream;
            }
        } catch (err) {
            alert("Camera permission denied. Please enable it in settings.");
        }
    };

    const startRecording = () => {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream, { mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localVideoChunks = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                localVideoChunks.push(event.data);
            }
        };

        mediaRecorder.current.onstop = async () => {
            const videoBlob = new Blob(localVideoChunks, { type: mimeType });
            const videoUrl = URL.createObjectURL(videoBlob);
            setRecordedVideo(videoUrl);
            setVideoChunks([]);
            onRecordingComplete(videoUrl);
        };
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
    };

    return (
        <Box>
            <Flex>
                {!permission && <Button onClick={getCameraPermission}>Enable Camera</Button>}
                {permission && recordingStatus === "inactive" && <Button onClick={startRecording}>Start Recording</Button>}
                {recordingStatus === "recording" && <Button onClick={stopRecording}>Stop Recording</Button>}
            </Flex>

            <video ref={liveVideoFeed} autoPlay playsInline muted style={{ width: "100%", marginTop: "10px" }} />

            {recordedVideo && (
                <Box>
                    <video src={recordedVideo} controls style={{ width: "100%", marginTop: "10px" }} />
                    <Button as="a" href={recordedVideo} download="recorded-video.webm">Download</Button>
                </Box>
            )}
        </Box>
    );
};

export default VideoRecorder;
