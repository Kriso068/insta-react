

import { Avatar, Box, Button, Divider, Flex, GridItem, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, VStack, useDisclosure,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment";
import PostFooter from "../FeedPosts/PostFooter";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import useShowToast from "../../hooks/useShowToast";
import { useState } from "react";
import { deleteObject, getMetadata, ref } from "firebase/storage";
import { firestore, storage } from "../../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import usePostStore from "../../store/postStore";
import Caption from "../Comment/Caption";

const ProfilePost = ({ post }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const userProfile = useUserProfileStore((state) => state.userProfile);
	const authUser = useAuthStore((state) => state.user);
	const showToast = useShowToast();
	const [isDeleting, setIsDeleting] = useState(false);
	const deletePost = usePostStore((state) => state.deletePost);
	const decrementPostsCount = useUserProfileStore((state) => state.deletePost);
	const updatePost = usePostStore((state) => state.addComment);

	const handleUpdatePost = async (comment) => {
		if (authUser && authUser.uid === comment.createdBy){
			console.log(comment);

		}

	}

	const handleDeletePost = async () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		if (isDeleting) return;
	
		setIsDeleting(true);
	
		try {
			// Delete only if the post has a valid file URL
			await deleteIfExists(ref(storage, `posts/${post.id}/image`), post.imageURL);
			await deleteIfExists(ref(storage, `posts/${post.id}/video`), post.videoURL);
			await deleteIfExists(ref(storage, `posts/${post.id}/recordedVideo`), post.videoRecordedURL);
	
			// Delete Post Document from Firestore
			const userRef = doc(firestore, "users", authUser.uid);
			await deleteDoc(doc(firestore, "posts", post.id));
			await updateDoc(userRef, {
				posts: arrayRemove(post.id),
			});
	
			// Update Local State
			deletePost(post.id);
			decrementPostsCount(post.id);
	
			showToast("Success", "Post deleted successfully", "success");
		} catch (error) {
			console.error("🔥 Error deleting post:", error);
			showToast("Error", "Failed to delete post.", "error");
		} finally {
			setIsDeleting(false);
		}
	};
	
	
	const deleteIfExists = async (fileRef, fileURL) => {
		if (!fileURL) {
			// Skip deletion if no URL is provided (prevents Firebase from making unnecessary requests)
			console.warn(`⚠️ Skipping deletion: No file URL for ${fileRef.fullPath}`);
			return;
		}
	
		try {
			await deleteObject(fileRef);
			console.log(`✅ Deleted: ${fileRef.fullPath}`);
		} catch (error) {
			if (error.code === "storage/object-not-found") {
				// Ignore 404 errors and prevent logs
				console.warn(`⚠️ File already deleted: ${fileRef.fullPath}`);
				return;
			}
			console.error(`🔥 Error deleting file: ${fileRef.fullPath}`, error);
		}
	};
	
	
	return (
		<>
			<GridItem
				cursor={"pointer"}
				borderRadius={4}
				overflow={"hidden"}
				border={"1px solid"}
				borderColor={"whiteAlpha.300"}
				position={"relative"}
				w={"100%"}
				h={"auto"}
				aspectRatio={1}
				onClick={onOpen}
			>
				<Flex
					opacity={0}
					_hover={{ opacity: 1 }}
					position={"absolute"}
					top={0}
					left={0}
					right={0}
					bottom={0}
					bg={"blackAlpha.700"}
					transition={"all 0.3s ease"}
					zIndex={1}
					justifyContent={"center"}
				>
					<Flex alignItems={"center"} justifyContent={"center"} gap={50}>
						<Flex>
							<AiFillHeart size={20} />
							<Text fontWeight={"bold"} ml={2}>
								{post.likes.length}
							</Text>
						</Flex>

						<Flex>
							<FaComment size={20} />
							<Text fontWeight={"bold"} ml={2}>
								{post.comments.length}
							</Text>
						</Flex>
					</Flex>
				</Flex>
				<Flex
					borderRadius={4}
					overflow={"hidden"}
					border={"1px solid"}
					borderColor={"whiteAlpha.300"}
					flex={{ base: "none", md: 1.5 }}
					justifyContent={"center"}
					alignItems={"center"}
					w={"100%"}
					h={"100%"}
				>

					{post.imageURL && (
						<Image src={post.imageURL} alt="FEED POST IMG" w={"100%"} h={"auto"} objectfit={"cover"} />
					)}
					{post.videoURL && (
						<video preload="true" controls src={post.videoURL} w={"100%"} h={"auto"} style={{ objectFit: "cover" }}></video>
					)}
					{post.videoRecordedURL && (
						<video preload="true" controls src={post.videoRecordedURL} alt="profile post" w={"100%"} h={"auto"} style={{ objectFit: "cover" }}></video>
					)}
				</Flex>
				
			</GridItem>

			<Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={{ base: "full", md: "5xl" }}>
				<ModalOverlay />
				<ModalContent
					bg="black" 
					pb={5} 
					maxH={"90vh"}
					maxW={"80vw"}
					overflowY="auto" 
				>
					<ModalCloseButton />
					<ModalBody bg={"black"} pb={5}>
						<Flex
							gap='4'
							w={{ base: "90%", sm: "70%", md: "full" }}
							mx={"auto"}
							maxH={"90vh"}
							minH={"50vh"}
							flexDir={{ base: "column", md: "row" }}
						>
							<Flex
								borderRadius={4}
								overflow={"hidden"}
								border={"1px solid"}
								borderColor={"whiteAlpha.300"}
								flex={{ base: "none", md: 1.5 }}
								justifyContent={"center"}
								alignItems={"center"}
							>
								{post.imageURL && (
									<Image src={post.imageURL} alt='profile post' w={"100%"} h={"100%"} objectfit={"cover"} />
								)}
								{post.videoURL && (
									<video preload="true" controls src={post.videoURL} w={"100%"} h={"100%"} style={{ objectFit: "cover" }}></video>
								)}
								{post.videoRecordedURL && (
									<video preload="true" controls src={post.videoRecordedURL} alt='profile post' w={"100%"} h={"100%"} style={{ objectFit: "cover" }}></video>
								)}
							</Flex>
							<Flex 
								flex={1} 
								flexDir={"column"} 
								px={10} 
								display="flex" 
								mt={{ base: 4, md: 0 }} 
							>
								<Flex alignItems={"center"} justifyContent={"space-between"}>
									<Flex alignItems={"center"} gap={4}>
										<Avatar src={userProfile.profilePicURL} size={"sm"} name='As a Programmer' />
										<Text fontWeight={"bold"} fontSize={12}>
											{userProfile.username}
										</Text>
									</Flex>

									{authUser?.uid === userProfile.uid && (
										<Button
											size={"sm"}
											bg={"transparent"}
											_hover={{ bg: "whiteAlpha.300", color: "red.600" }}
											borderRadius={4}
											p={1}
											onClick={handleDeletePost}
											isLoading={isDeleting}
										>
											<MdDelete size={20} cursor='pointer' />
										</Button>
									)}
								</Flex>
								<Divider my={4} bg={"gray.500"} />

								<VStack w='full' alignItems={"start"} maxH={"350px"} overflowY={"auto"}>
									{/* CAPTION */}
									{post.caption && <Caption post={post} />}
									{/* COMMENTS */}
									{post.comments.map((comment, id) => (
										authUser && authUser.uid === comment.createdBy ? (
											<Box
												key={id}
												cursor={"pointer"}
												_hover={{ bg: "whiteAlpha.300", color: "white" }}
											>
												<Comment comment={comment} onClick={() => handleUpdatePost(comment)} />
											</Box>
										) : (
											<Box
												key={id}
												cursor={"pointer"}
												_hover={{ bg: "whiteAlpha.300", color: "red" }}
											>
												<Comment comment={comment} onClick={() => handleUpdatePost(comment)} />
											</Box>
										)
									))}

								</VStack>
								<Divider my={4} bg={"gray.8000"} />

								<PostFooter isProfilePage={true} post={post} />
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfilePost;

