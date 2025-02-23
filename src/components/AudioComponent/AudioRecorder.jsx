import { useState, useRef } from "react";
import RecordRTC from "recordrtc";

const AudioRecorder = () => {
  const mimeType = "audio/webm";
  const [permission, setPermission] = useState(false);
  const recorderRef = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audio, setAudio] = useState(null);

  const getMicrophonePermission = async () => {
    if (!navigator.mediaDevices) {
      alert("Your browser does not support audio recording.");
      return;
    }

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setPermission(true);
      setStream(streamData);
    } catch (err) {
      alert("Microphone permission denied.");
    }
  };

  const startRecording = () => {
    if (!stream) return;
    setRecordingStatus("recording");
    recorderRef.current = new RecordRTC(stream, {
      type: "audio",
      mimeType,
    });
    recorderRef.current.startRecording();
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        const audioUrl = URL.createObjectURL(blob);
        setAudio(audioUrl);
      });
    }
    setRecordingStatus("inactive");
  };

  return (
    <div>
      {!permission && (
        <button onClick={getMicrophonePermission}>Enable Microphone</button>
      )}
      {permission && recordingStatus === "inactive" && (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {recordingStatus === "recording" && (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      {audio && (
        <div>
          <audio src={audio} controls />
          <a href={audio} download="recorded-audio.webm">
            Download
          </a>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
