
import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import usePostStore from "../store/postStore";

const usePostComment = () => {
	const [isCommenting, setIsCommenting] = useState(false);
	const showToast = useShowToast();
	const authUser = useAuthStore((state) => state.user);
	const addComment = usePostStore((state) => state.addComment);
	const updateComment = usePostStore((state) => state.updateComment);
	const removeComment = usePostStore((state) => state.removeComment);

	//Handle posting a new comment
	const handlePostComment = async (postId, commentText) => {
		if (isCommenting) return;
		if (!authUser) return showToast("Error", "You must be logged in to comment", "error");

		setIsCommenting(true);
		const newComment = {
			id: Date.now().toString(), // Assigning a unique ID
			comment: commentText,
			createdAt: Date.now(),
			createdBy: authUser.uid,
			postId,
		};

		try {
			const postRef = doc(firestore, "posts", postId);
			const postSnap = await getDoc(postRef);

			if (postSnap.exists()) {
				const post = postSnap.data();
				const updatedComments = [...post.comments, newComment];

				await updateDoc(postRef, { comments: updatedComments });
				addComment(postId, newComment);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsCommenting(false);
		}
	};

	//Handle editing a comment correctly
	const handleEditComment = async (postId, commentId, newText) => {
		if (!authUser) return;
	
		try {
			const postRef = doc(firestore, "posts", postId);
			const postSnap = await getDoc(postRef);
	
			if (postSnap.exists()) {
				const post = postSnap.data();
	
				// ✅ Ensure only the logged-in user's comment is updated
				const updatedComments = post.comments.map((comment) =>
					comment.id === commentId && comment.createdBy === authUser.uid
						? { ...comment, comment: newText }
						: comment
				);
	
				await updateDoc(postRef, { comments: updatedComments });
				updateComment(postId, commentId, newText);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	// const handleEditComment = async (postId, commentId, newText) => {
	// 	if (!authUser) return;

	// 	try {
	// 		const postRef = doc(firestore, "posts", postId);
	// 		const postSnap = await getDoc(postRef);

	// 		if (postSnap.exists()) {
	// 			const post = postSnap.data();
	// 			const updatedComments = post.comments.map((comment) =>
	// 				comment.id === commentId ? { ...comment, comment: newText } : comment
	// 			);

	// 			await updateDoc(postRef, { comments: updatedComments });
	// 			updateComment(postId, commentId, newText);
	// 		}
	// 	} catch (error) {
	// 		showToast("Error", error.message, "error");
	// 	}
	// };

	//Handle deleting a comment
	const handleDeleteComment = async (postId, commentId) => {
		if (!authUser) return;

		try {
			const postRef = doc(firestore, "posts", postId);
			const postSnap = await getDoc(postRef); 

			if (postSnap.exists()) {
				const post = postSnap.data();
				const updatedComments = post.comments.filter((comment) => comment.id !== commentId);

				await updateDoc(postRef, { comments: updatedComments });
				removeComment(postId, commentId);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return { isCommenting, handlePostComment, handleEditComment, handleDeleteComment };
};

export default usePostComment;


