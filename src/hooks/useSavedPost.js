import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSavedPost = (post) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const [saves, setSaves] = useState(post.saved.length);
	const [isSaved, setIsSaved] = useState(post.saved.includes(authUser?.uid));
	const showToast = useShowToast();

	const handleSavedPost = async () => {
		if (isUpdating) return;
		if (!authUser) return showToast("Error", "You must be logged in to like a post", "error");
		setIsUpdating(true);

		try {
			const postRef = doc(firestore, "posts", post.id);
			await updateDoc(postRef, {
				saved: isSaved ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
			});

			setIsSaved(!isSaved);
			isSaved ? setSaves(saves - 1) : setSaves(saves + 1);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsUpdating(false);
		}
	};

	return { isSaved, saves, handleSavedPost, isUpdating };
};

export default useSavedPost;