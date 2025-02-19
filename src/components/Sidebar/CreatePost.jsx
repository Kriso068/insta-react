import {
	Box,
	Button,
	CloseButton,
	Flex,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { BsFillImageFill, BsCameraVideoFill, BsFillCameraFill } from "react-icons/bs";
import { useRef, useState } from "react";
import usePreviewImg from "../../hooks/usePreviewImg";
import usePreviewVideo from "../../hooks/usePreviewVideo";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import { useLocation } from "react-router-dom";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import VideoRecorder from "../VideoComponent/VideoRecorder";

const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [caption, setCaption] = useState("");
	const imageRef = useRef(null);
	const videoRef = useRef(null);
	const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
	const { handleVideoChange, selectedVideoFile, setSelectedVideoFile } = usePreviewVideo();
	const showToast = useShowToast();
	const { isLoading, handleCreatePost } = useCreatePost();
	const [recordOption, setRecordOption] = useState(null);
	const [selectedVideoRecordedFile, setSelectedVideoRecordedFile] = useState(null);

	// Handle Image Selection (Clear other selections)
	const handleImageSelect = (event) => {
		handleImageChange(event);
		setSelectedVideoFile(null);
		setSelectedVideoRecordedFile(null);
		setRecordOption(null);
	};

	// Handle Video Selection (Clear other selections)
	const handleVideoSelect = (event) => {
		handleVideoChange(event);
		setSelectedFile(null);
		setSelectedVideoRecordedFile(null);
		setRecordOption(null);
	};

	// Handle Recorded Video Selection (Clear other selections)
	const handleRecordingComplete = (videoUrl) => {
		setSelectedVideoRecordedFile(videoUrl);
		setSelectedFile(null);
		setSelectedVideoFile(null);
		setRecordOption("video");
	};

	const handlePostCreation = async () => {
		try {
			await handleCreatePost(selectedFile, selectedVideoFile, selectedVideoRecordedFile, caption);
			onClose();
			setCaption("");
			setSelectedFile(null);
			setSelectedVideoFile(null);
			setSelectedVideoRecordedFile(null);
			setRecordOption(null);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return (
		<>
			<Tooltip hasArrow label={"Create"} placement="right" ml={1} openDelay={500} display={{ base: "block", md: "none" }}>
				<Flex alignItems={"center"} gap={4} _hover={{ bg: "whiteAlpha.400" }} borderRadius={6} p={2} w={{ base: 10, md: "full" }} justifyContent={{ base: "center", md: "flex-start" }} onClick={onOpen}>
					<CreatePostLogo />
					<Box display={{ base: "none", md: "block" }}>Create</Box>
				</Flex>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent bg={"black"} border={"1px solid gray"}>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Textarea placeholder="Post caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />

						{/* Hidden Inputs */}
						<Input type="file" hidden ref={imageRef} onChange={handleImageSelect} />
						<Input type="file" hidden ref={videoRef} onChange={handleVideoSelect} />

						{/* Selection Icons */}
						<Flex gap={"15px"}>
							<BsFillImageFill
								onClick={() => imageRef.current.click()}
								style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer", opacity: selectedFile ? 1 : 0.5 }}
								size={16}
							/>
							<BsCameraVideoFill
								onClick={() => videoRef.current.click()}
								style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer", opacity: selectedVideoFile ? 1 : 0.5 }}
								size={16}
							/>
							<BsFillCameraFill
								onClick={() => setRecordOption("video")}
								style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer", opacity: selectedVideoRecordedFile ? 1 : 0.5 }}
								size={16}
							/>

							{recordOption === "video" && <VideoRecorder onRecordingComplete={handleRecordingComplete} />}
						</Flex>

						{/* Display Selected Media */}
						{selectedFile && (
							<Flex mt={5} w={"full"} position={"relative"} justifyContent={"center"}>
								<Image src={selectedFile} alt="Selected img" mt={45} />
								<CloseButton fontSize={"lg"} _hover={{ color: "black", bg: "red" }} position={"absolute"} color={"red"} top={2} right={2} onClick={() => setSelectedFile(null)} />
							</Flex>
						)}

						{selectedVideoFile && (
							<Flex mt={5} w={"full"} position={"relative"} justifyContent={"center"}>
								<video mt={45} controls src={selectedVideoFile}></video>
								<CloseButton fontSize={"lg"} _hover={{ color: "black", bg: "red" }} position={"absolute"} color={"red"} top={2} right={2} onClick={() => setSelectedVideoFile(null)} />
							</Flex>
						)}

						{selectedVideoRecordedFile && (
							<Flex mt={5} w={"full"} position={"relative"} justifyContent={"center"}>
								<video mt={45} controls src={selectedVideoRecordedFile}></video>
								<CloseButton fontSize={"lg"} _hover={{ color: "black", bg: "red" }} position={"absolute"} color={"red"} top={2} right={2} onClick={() => setSelectedVideoRecordedFile(null)} />
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						<Button mr={3} onClick={handlePostCreation} isLoading={isLoading}>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;


function useCreatePost() {
	const showToast = useShowToast();
	const [isLoading, setIsLoading] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const createPost = usePostStore((state) => state.createPost);
	const addPost = useUserProfileStore((state) => state.addPost);
	const userProfile = useUserProfileStore((state) => state.userProfile);
	const { pathname } = useLocation();

	const handleCreatePost = async (selectedFile, selectedVideoFile, selectedVideoRecordedFile, caption) => {
		if (isLoading) return;

		// Ensure the user is authenticated before proceeding
		if (!authUser || !authUser.uid) {
			showToast("Error", "User not authenticated. Please log in again.", "error");
			return;
		}

		// Ensure at least one file is provided
		if (!selectedFile && !selectedVideoFile && !selectedVideoRecordedFile) {
			showToast("Error", "Please select an image or a video.", "error");
			return;
		}

		setIsLoading(true);
		console.log("Auth User:", authUser); // Debugging output

		try {
			// Create a new Firestore document for the post
			const newPost = {
				caption,
				likes: [],
				saved: [],
				comments: [],
				createdAt: Date.now(),
				createdBy: authUser.uid,
			};

			const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
			const userDocRef = doc(firestore, "users", authUser.uid);
			await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });

			// Upload Image if exists
			if (selectedFile) {
				const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
				await uploadString(imageRef, selectedFile, "data_url");
				const imageURL = await getDownloadURL(imageRef);
				await updateDoc(postDocRef, { imageURL });
			}

			// Upload Video if exists
			if (selectedVideoFile) {
				const videoRef = ref(storage, `posts/${postDocRef.id}/video`);
				await uploadString(videoRef, selectedVideoFile, "data_url");
				const videoURL = await getDownloadURL(videoRef);
				await updateDoc(postDocRef, { videoURL });
			}

			// Upload Recorded Video (Fixes Invalid Format Issue)
			if (selectedVideoRecordedFile) {
				try {
					// Fetch the Blob from the Blob URL
					const response = await fetch(selectedVideoRecordedFile);
					const blob = await response.blob();

					// Upload Blob to Firebase Storage
					const videoRef = ref(storage, `posts/${postDocRef.id}/recordedVideo.webm`);
					await uploadBytes(videoRef, blob);
					const videoRecordedURL = await getDownloadURL(videoRef);

					// Update Firestore with the video URL
					await updateDoc(postDocRef, { videoRecordedURL });
				} catch (error) {
					console.error("Error uploading recorded video:", error);
					showToast("Error", "Failed to upload recorded video.", "error");
				}
			}

			// Update Local State
			if (userProfile?.uid === authUser.uid) createPost({ ...newPost, id: postDocRef.id });
			if (pathname !== "/" && userProfile?.uid === authUser.uid) addPost({ ...newPost, id: postDocRef.id });

			showToast("Success", "Post created successfully", "success");
		} catch (error) {
			console.error("Firestore Error:", error);
			showToast("Error", error.message, "error");
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleCreatePost };
}
