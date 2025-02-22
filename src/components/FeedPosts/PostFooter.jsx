
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Avatar } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BookmarkLogo, BookmarkLogoFull, CommentLogo, NotificationsLogo, UnlikeLogo } from "../../assets/constants";
import usePostComment from "../../hooks/usePostComment";
import useAuthStore from "../../store/authStore";
import useLikePost from "../../hooks/useLikePost";
import { timeAgo } from "../../utils/timeAgo";
import CommentsModal from "../Modals/CommentsModal";
import useSavedPost from "../../hooks/useSavedPost";

const PostFooter = ({ post, isProfilePage, creatorProfile }) => {
	const { isCommenting, handlePostComment } = usePostComment();
	const [comment, setComment] = useState("");
	const authUser = useAuthStore((state) => state.user);
	const commentRef = useRef(null);
	const { handleLikePost, isLiked, likes, likedUsers } = useLikePost(post);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { handleSavedPost, isSaved } = useSavedPost(post);
	const { isOpen: isLikesOpen, onOpen: openLikes, onClose: closeLikes } = useDisclosure();

	const handleSubmitComment = async () => {
		await handlePostComment(post.id, comment);
		setComment("");
	};

	return (
		<Box mb={10} marginTop={"auto"}>
			<Flex alignItems={"center"} gap={6} w={"full"} pt={0} mb={2} mt={4}>
				<Box onClick={handleLikePost} cursor={"pointer"} fontSize={18}>
					{!isLiked ? <NotificationsLogo /> : <UnlikeLogo />}
				</Box>

				<Box cursor={"pointer"} fontSize={18} onClick={() => commentRef.current.focus()}>
					<CommentLogo />
				</Box>
				<Box cursor={"pointer"} fontSize={18} onClick={handleSavedPost}>
					{!isSaved ? <BookmarkLogo /> : <BookmarkLogoFull />}  
                </Box>
			</Flex>

			{/* Clickable Likes Count */}
			<Text fontWeight={600} fontSize={"sm"} cursor="pointer" onClick={openLikes}>
				{likes} likes
			</Text>

			{/* Likes Modal */}
			<Modal isOpen={isLikesOpen} onClose={closeLikes}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>People who liked this post</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{likedUsers.length === 0 ? (
							<Text>No likes yet.</Text>
						) : (
							likedUsers.map((user) => (
								<Flex key={user.uid} align="center" gap={2} mb={2}>
									<Avatar 
										src={user.profilePicURL} 
										alt={user.username}
									 	width={30} 
										height={30} />
									<Text>{user.username}</Text>
								</Flex>
							))
						)}
					</ModalBody>
				</ModalContent>
			</Modal>

			{isProfilePage && (
				<Text fontSize='12' color={"gray"}>
					Posted {timeAgo(post.createdAt)}
				</Text>
			)}

			{!isProfilePage && (
				<>
					<Text fontSize='sm' fontWeight={700}>
						{creatorProfile?.username}{" "}
						<Text as='span' fontWeight={400}>
							{post.caption}
						</Text>
					</Text>
					{post.comments.length > 0 && (
						<Text fontSize='sm' color={"gray"} cursor={"pointer"} onClick={onOpen}>
							View all {post.comments.length} comments
						</Text>
					)}
					{isOpen ? <CommentsModal isOpen={isOpen} onClose={onClose} post={post} /> : null}
				</>
			)}

			{authUser && (
				<Flex alignItems={"center"} gap={2} justifyContent={"space-between"} w={"full"}>
					<InputGroup>
						<Input
							variant={"flushed"}
							placeholder={"Add a comment..."}
							fontSize={14}
							onChange={(e) => setComment(e.target.value)}
							value={comment}
							ref={commentRef}
						/>
						<InputRightElement>
							<Button fontSize={14} color={"blue.500"} fontWeight={600} cursor={"pointer"} _hover={{ color: "white" }} bg={"transparent"} onClick={handleSubmitComment} isLoading={isCommenting}>
								Post
							</Button>
						</InputRightElement>
					</InputGroup>
				</Flex>
			)}
		</Box>
	);
};

export default PostFooter;
