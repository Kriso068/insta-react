// import {
// 	Button,
// 	Flex,
// 	Input,
// 	Modal,
// 	ModalBody,
// 	ModalCloseButton,
// 	ModalContent,
// 	ModalHeader,
// 	ModalOverlay,
// } from "@chakra-ui/react";
// import Comment from "../Comment/Comment";
// import usePostComment from "../../hooks/usePostComment";
// import { useEffect, useRef } from "react";

// const CommentsModal = ({ isOpen, onClose, post }) => {
// 	const { handlePostComment, isCommenting } = usePostComment();
// 	const commentRef = useRef(null);
// 	const commentsContainerRef = useRef(null);

// 	const handleSubmitComment = async (e) => {
// 		// do not refresh the page, prevent it
// 		e.preventDefault();
// 		await handlePostComment(post.id, commentRef.current.value);
// 		commentRef.current.value = "";
// 	};

// 	useEffect(() => {
// 		const scrollToBottom = () => {
// 			commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
// 		};
// 		if (isOpen) {
// 			setTimeout(() => {
// 				scrollToBottom();
// 			}, 100);
// 		}
// 	}, [isOpen, post.comments.length]);

// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
// 			<ModalOverlay />
// 			<ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
// 				<ModalHeader>Comments</ModalHeader>
// 				<ModalCloseButton />
// 				<ModalBody pb={6}>
// 					<Flex
// 						mb={4}
// 						gap={4}
// 						flexDir={"column"}
// 						maxH={"250px"}
// 						overflowY={"auto"}
// 						ref={commentsContainerRef}
// 					>
// 						{post.comments.map((comment, idx) => (
// 							<Comment key={idx} comment={comment} />
// 						))}
// 					</Flex>
// 					<form onSubmit={handleSubmitComment} style={{ marginTop: "2rem" }}>
// 						<Input placeholder='Comment' size={"sm"} ref={commentRef} />
// 						<Flex w={"full"} justifyContent={"flex-end"}>
// 							<Button type='submit' ml={"auto"} size={"sm"} my={4} isLoading={isCommenting}>
// 								Post
// 							</Button>
// 						</Flex>
// 					</form>
// 				</ModalBody>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default CommentsModal;
import {
	Button,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { MdEdit, MdCheck, MdClose } from "react-icons/md";
import Comment from "../Comment/Comment";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import usePostStore from "../../store/postStore";
import useAuthStore from "../../store/authStore";

const CommentsModal = ({ isOpen, onClose, post }) => {
	const toast = useToast();
	const commentRef = useRef(null);
	const commentsContainerRef = useRef(null);
	const addCommentToState = usePostStore((state) => state.addComment);
	const updateCommentInState = usePostStore((state) => state.updateComment);
	const authUser = useAuthStore((state) => state.user);
	const [isCommenting, setIsCommenting] = useState(false);

	// Edit comment state
	const [editingCommentId, setEditingCommentId] = useState(null);
	const [editedComment, setEditedComment] = useState("");

	// Function to add a new comment
	const handleAddComment = async (e) => {
		e.preventDefault();
		const newCommentText = commentRef.current.value.trim();
		if (!newCommentText) return;

		setIsCommenting(true);
		try {
			const newComment = {
				id: Date.now().toString(),
				text: newCommentText,
				userId: authUser.uid,
				username: authUser.username,
				profilePic: authUser.profilePicURL,
				createdAt: new Date().toISOString(),
			};

			// Update Firestore
			const postRef = doc(firestore, "posts", post.id);
			const updatedComments = [...post.comments, newComment];
			await updateDoc(postRef, { comments: updatedComments });

			// Update Zustand state
			addCommentToState(post.id, newComment);
			commentRef.current.value = "";
			toast({ title: "Comment posted!", status: "success", duration: 2000 });
		} catch (error) {
			console.error("Error adding comment:", error);
			toast({ title: "Error posting comment", status: "error", duration: 2000 });
		}
		setIsCommenting(false);
	};

	// Function to start editing a comment
	const handleEditComment = (comment) => {
		setEditingCommentId(comment.id);
		setEditedComment(comment.text);
	};

	// Function to save an edited comment
	const handleSaveComment = async (commentId) => {
		if (!editedComment.trim()) return;

		try {
			// Update Firestore
			const postRef = doc(firestore, "posts", post.id);
			const updatedComments = post.comments.map((comment) =>
				comment.id === commentId ? { ...comment, text: editedComment } : comment
			);
			await updateDoc(postRef, { comments: updatedComments });

			// Update Zustand state
			updateCommentInState(post.id, commentId, editedComment);
			setEditingCommentId(null);
			toast({ title: "Comment updated!", status: "success", duration: 2000 });
		} catch (error) {
			console.error("Error updating comment:", error);
			toast({ title: "Error updating comment", status: "error", duration: 2000 });
		}
	};

	// Function to cancel editing
	const handleCancelEdit = () => {
		setEditingCommentId(null);
		setEditedComment("");
	};

	// Auto-scroll to latest comment when modal opens
	useEffect(() => {
		const scrollToBottom = () => {
			commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
		};
		if (isOpen) {
			setTimeout(() => {
				scrollToBottom();
			}, 100);
		}
	}, [isOpen, post.comments.length]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
			<ModalOverlay />
			<ModalContent bg="black" border="1px solid gray" maxW="400px">
				<ModalHeader>Comments</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<Flex mb={4} gap={4} flexDir="column" maxH="250px" overflowY="auto" ref={commentsContainerRef}>
						{post.comments.map((comment, idx) => (
							<Flex key={idx} justify="space-between" align="center">
								{/* If editing, show input field */}
								{editingCommentId === comment.id ? (
									<Flex w="full" align="center">
										<Input
											value={editedComment}
											onChange={(e) => setEditedComment(e.target.value)}
											bg="gray.700"
											color="white"
											size="sm"
										/>
										<Button size="sm" colorScheme="green" ml={2} onClick={() => handleSaveComment(comment.id)}>
											<MdCheck />
										</Button>
										<Button size="sm" colorScheme="red" ml={2} onClick={handleCancelEdit}>
											<MdClose />
										</Button>
									</Flex>
								) : (
									<Flex w="full" align="center">
										<Comment comment={comment} />
									</Flex>
								)}

								{/* Show edit button only for user's own comments */}
								{authUser?.uid === comment.userId && editingCommentId !== comment.id && (
									<Button size="sm" bg="transparent" _hover={{ bg: "whiteAlpha.300" }} borderRadius={4} p={1} onClick={() => handleEditComment(comment)}>
										<MdEdit size={18} />
									</Button>
								)}
							</Flex>
						))}
					</Flex>

					{/* Comment Input */}
					<form onSubmit={handleAddComment} style={{ marginTop: "2rem" }}>
						<Input placeholder="Comment" size="sm" ref={commentRef} />
						<Flex w="full" justifyContent="flex-end">
							<Button type="submit" ml="auto" size="sm" my={4} isLoading={isCommenting}>
								Post
							</Button>
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default CommentsModal;
