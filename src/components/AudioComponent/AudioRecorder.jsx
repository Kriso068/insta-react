
// import { useState, useRef } from "react";

// const AudioRecorder = () => {
//     const mimeType = "audio/webm";
//     const [permission, setPermission] = useState(false);
//     const mediaRecorder = useRef(null);
//     const [recordingStatus, setRecordingStatus] = useState("inactive");
//     const [stream, setStream] = useState(null);
//     const [audioChunks, setAudioChunks] = useState([]);
//     const [audio, setAudio] = useState(null);

//     const getMicrophonePermission = async () => {
//         if (!navigator.mediaDevices || !window.MediaRecorder) {
//             alert("Your browser does not support audio recording.");
//             return;
//         }

//         try {
//             const streamData = await navigator.mediaDevices.getUserMedia({ audio: true });
//             setPermission(true);
//             setStream(streamData);
//         } catch (err) {
//             alert("Microphone permission denied.");
//         }
//     };

//     const startRecording = () => {
//         setRecordingStatus("recording");
//         const media = new MediaRecorder(stream, { mimeType });
//         mediaRecorder.current = media;
//         mediaRecorder.current.start();
//         let localAudioChunks = [];

//         mediaRecorder.current.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 localAudioChunks.push(event.data);
//             }
//         };

//         mediaRecorder.current.onstop = () => {
//             const audioBlob = new Blob(localAudioChunks, { type: mimeType });
//             const audioUrl = URL.createObjectURL(audioBlob);
//             setAudio(audioUrl);
//         };
//     };

//     const stopRecording = () => {
//         setRecordingStatus("inactive");
//         mediaRecorder.current.stop();
//     };

//     return (
//         <div>
//             {!permission && <button onClick={getMicrophonePermission}>Enable Microphone</button>}
//             {permission && recordingStatus === "inactive" && <button onClick={startRecording}>Start Recording</button>}
//             {recordingStatus === "recording" && <button onClick={stopRecording}>Stop Recording</button>}

//             {audio && (
//                 <div>
//                     <audio src={audio} controls />
//                     <a href={audio} download="recorded-audio.webm">Download</a>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AudioRecorder;

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
