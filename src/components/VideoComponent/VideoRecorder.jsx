import { Box, Button, Flex } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
const VideoRecorder = ({onRecordingComplete}) => {

    const mimeType = "video/webm";
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
        if ("MediaRecorder" in window) {
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
                //combine both audio and video streams
                const combinedStream = new MediaStream([
                    ...videoStream.getVideoTracks(),
                    ...audioStream.getAudioTracks(),
                ]);
                setStream(combinedStream);
                //set videostream to live feed player
                liveVideoFeed.current.srcObject = videoStream;
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
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
    };

    const stopRecording = () => {
        setPermission(false);
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const videoBlob = new Blob(videoChunks, { type: mimeType });
            const videoUrl = URL.createObjectURL(videoBlob);
            setRecordedVideo(videoUrl);
            setVideoChunks([]);
            onRecordingComplete(videoUrl);
        };
    };

    return (
        <div>
            <Flex>
                {!permission ? (
                    <Button onClick={getCameraPermission}>
                        Get camera
                    </Button>
                ) : null}
                 {permission && recordingStatus === "inactive" ? (
                    <Button onClick={startRecording} >
                        Start Recording
                    </Button>
                ) : null}
                {recordingStatus === "recording" ? (
                    <Button onClick={stopRecording}>
                        Stop Recording
                    </Button>
                ) : null}
            </Flex>
            <Flex>
                {/* {recordedVideo ? (
                    <Box>
                        <video src={recordedVideo} controls></video>
                        <Button>
                            <a download href={recordedVideo}>
                                Download Recording
                            </a>
                        </Button>
                    </Box>
                ) : null} */}
            </Flex>

        </div>
    );
};
export default VideoRecorder;