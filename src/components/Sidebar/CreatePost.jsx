
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
import { BsFillImageFill } from "react-icons/bs";
import { BsCameraVideoFill } from "react-icons/bs";
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
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import VideoRecorder from "../VideoComponent/VideoRecorder";
import { BsFillCameraFill } from "react-icons/bs";


const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [caption, setCaption] = useState("");
	const imageRef = useRef(null);
	const videoRef = useRef(null);
	const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
	const { handleVideoChange, selectedVideoFile, setSelectedVideoFile } = usePreviewVideo();
	const showToast = useShowToast();
	const { isLoading, handleCreatePost } = useCreatePost();

	const handlePostCreation = async () => {
		try {
			await handleCreatePost(selectedFile,selectedVideoFile, caption);
			onClose();
			setCaption("");
			setSelectedFile(null);
			setSelectedVideoFile(null);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};


	let [recordOption, setRecordOption] = useState("video");

	return (
		<>
			<Tooltip
				hasArrow
				label={"Create"}
				placement='right'
				ml={1}
				openDelay={500}
				display={{ base: "block", md: "none" }}
			>
				<Flex
					alignItems={"center"}
					gap={4}
					_hover={{ bg: "whiteAlpha.400" }}
					borderRadius={6}
					p={2}
					w={{ base: 10, md: "full" }}
					justifyContent={{ base: "center", md: "flex-start" }}
					onClick={onOpen}
				>
					<CreatePostLogo />
					<Box display={{ base: "none", md: "block" }}>Create</Box>
				</Flex>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose} size='xl'>
				<ModalOverlay />

				<ModalContent bg={"black"} border={"1px solid gray"}>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Textarea
							placeholder='Post caption...'
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
						/>

						<Input type='file' hidden ref={imageRef} onChange={handleImageChange} />
						<Input type='file' hidden ref={videoRef} onChange={handleVideoChange} />

						<Flex gap={'15px'}>
							<BsFillImageFill
								onClick={() => imageRef.current.click()}
								style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }}
								size={16}
							/>
							<BsCameraVideoFill
								onClick={() => videoRef.current.click()}
								style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }}
								size={16}
							/>

							<BsFillCameraFill
								onClick={()=>setRecordOption("video")}
								style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }}
								size={16}
							/>

							{recordOption === "video" ? <VideoRecorder /> : <AudioRecorder />}
							
						</Flex>
						{selectedFile && (
							<Flex mt={5} w={"full"} position={"relative"} justifyContent={"center"}>
								<Image src={selectedFile} alt='Selected img' mt={45}/>
								<CloseButton
                  					fontSize={"lg"}
                  					_hover={{color:"black", bg:"red"}}
									position={"absolute"}
                  					color={"red"}
									top={2}
									right={2}
									onClick={() => {
										setSelectedFile(null);
									}}
								/>
							</Flex>
						)}
						{selectedVideoFile && (
							<Flex mt={5} w={"full"} position={"relative"} justifyContent={"center"}>
								<video mt={45} controls src={selectedVideoFile}></video>
								<CloseButton
                  					fontSize={"lg"}
                  					_hover={{color:"black", bg:"red"}}
									position={"absolute"}
                  					color={"red"}
									top={2}
									right={2}
									onClick={() => {
										setSelectedVideoFile(null);
									}}
								/>
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

	
	const handleCreatePost = async (selectedFile, selectedVideoFile, caption) => {
		if (isLoading) return;
		if (!selectedFile && !selectedVideoFile) throw new Error("Please select either an image or a video");
		setIsLoading(true);
	
		try {
			const newPost = {
				caption: caption,
				likes: [],
				saved: [],
				comments: [],
				createdAt: Date.now(),
				createdBy: authUser.uid,
			};
	
			const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
			const userDocRef = doc(firestore, "users", authUser.uid);
	
			await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
	
			if (selectedFile) {
				const imageRef = ref(storage, `posts/${postDocRef.id}`);
				await uploadString(imageRef, selectedFile, "data_url");
				const imageURL = await getDownloadURL(imageRef);
				await updateDoc(postDocRef, { imageURL: imageURL });
			}
	
			if (selectedVideoFile) {
				const videoRef = ref(storage, `posts/${postDocRef.id}`);
				await uploadString(videoRef, selectedVideoFile, "data_url");
				const videoURL = await getDownloadURL(videoRef);
				await updateDoc(postDocRef, { videoURL: videoURL });
			}
	
			if (userProfile.uid === authUser.uid) createPost({ ...newPost, id: postDocRef.id });
	
			if (pathname !== "/" && userProfile.uid === authUser.uid) addPost({ ...newPost, id: postDocRef.id });
	
			showToast("Success", "Post created successfully", "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleCreatePost };
}
