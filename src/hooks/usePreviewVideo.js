import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewVideo = () => {
	const [selectedVideoFile, setSelectedVideoFile] = useState(null);
	const showToast = useShowToast();
	const maxFileSizeInBytes = 40 * 1024 * 1024; // 40MB

	const handleVideoChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("video/")) {
			if (file.size > maxFileSizeInBytes) {
				showToast("Error", "File size must be less than 40MB", "error");
				setSelectedVideoFile(null);
				return;
			}
			const reader = new FileReader();

			reader.onloadend = () => {
				setSelectedVideoFile(reader.result);
			};

			reader.readAsDataURL(file);
		} else {
			showToast("Error", "Please select an video file", "error");
			setSelectedVideoFile(null);
		}
	};

	return { selectedVideoFile, handleVideoChange, setSelectedVideoFile };
};

export default usePreviewVideo;
