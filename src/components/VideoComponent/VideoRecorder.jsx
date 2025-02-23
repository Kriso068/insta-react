import { Box, Button, Flex } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import RecordRTC from "recordrtc";

const VideoRecorder = ({ onRecordingComplete }) => {
  const desiredMimeType = "video/webm; codecs=vp8,opus";
  const [permission, setPermission] = useState(false);
  const recorderRef = useRef(null);
  const liveVideoFeed = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [downloadExt, setDownloadExt] = useState("webm");

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    if (!navigator.mediaDevices) {
      alert("Your browser does not support video recording.");
      return;
    }
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
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
    if (!stream) return;
    setRecordingStatus("recording");

    // Check if desired MIME type is supported
    let mimeType = desiredMimeType;
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "";
    }
    
    recorderRef.current = new RecordRTC(stream, {
      type: "video",
      mimeType: mimeType || undefined,
      recorderType: RecordRTC.MediaStreamRecorder,
    });
    recorderRef.current.startRecording();
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();

        // Adjust download extension based on blob type
        let ext = "webm";
        if (blob.type.includes("matroska")) {
          ext = "mkv";
        }
        setDownloadExt(ext);

        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        onRecordingComplete(videoUrl);
      });
    }
    setRecordingStatus("inactive");
  };

  return (
    <Box>
      <Flex>
        {!permission && (
          <Button onClick={getCameraPermission}>Enable Camera</Button>
        )}
        {permission && recordingStatus === "inactive" && (
          <Button onClick={startRecording}>Start Recording</Button>
        )}
        {recordingStatus === "recording" && (
          <Button onClick={stopRecording}>Stop Recording</Button>
        )}
      </Flex>

      <video
        ref={liveVideoFeed}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", marginTop: "10px" }}
      />

      {recordedVideo && (
        <Box>
          <video
            src={recordedVideo}
            controls
            style={{ width: "100%", marginTop: "10px" }}
          />
          <Button as="a" href={recordedVideo} download={`recorded-video.${downloadExt}`}>
            Download
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VideoRecorder;


