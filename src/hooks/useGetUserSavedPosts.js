import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where} from "firebase/firestore";
import { firestore } from "../firebase/firebase";


const useGetUserSavedPosts = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { posts, setSavedPosts } = usePostStore();
	const showToast = useShowToast();
	const userProfile = useUserProfileStore((state) => state.userProfile);

	useEffect(() => {
		const getSavedPosts = async () => {
			if (!userProfile) return;
			setIsLoading(true);
			setSavedPosts([]);

			try {
				const q = query(collection(firestore, "posts"), where("saved", "array-contains", userProfile.uid));
				const querySnapshot = await getDocs(q);

				const posts = [];
				querySnapshot.forEach((doc) => {
                    posts.push({ ...doc.data(), id: doc.id });
				});

				posts.sort((a, b) => b.createdAt - a.createdAt);
				setSavedPosts(posts);
			} catch (error) {
				showToast("Error", error.message, "error");
				setSavedPosts([]);
			} finally {
				setIsLoading(false);
			}
		};

		getSavedPosts();
	}, [setSavedPosts, userProfile, showToast]);

	return { isLoading, posts };
};

export default useGetUserSavedPosts;