import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const useFollowerUser = (userId) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [isFollower, setIsFollower] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const setAuthUser = useAuthStore((state) => state.setUser);
	const { userProfile, setUserProfile } = useUserProfileStore();
	const showToast = useShowToast();

	const handleFollowerUser = async () => {

		setIsUpdating(true);
		try {
			const currentUserRef = doc(firestore, "users", authUser.uid);
			const userToFollowOrUnfollorRef = doc(firestore, "users", userId);
			await updateDoc(currentUserRef, {
				follower: isFollower ? arrayRemove(userId) : arrayUnion(userId),
			});

			await updateDoc(userToFollowOrUnfollorRef, {
				followers: isFollower ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
			});

			if (isFollower) {
				// unfollow
				setAuthUser({
					...authUser,
					follower: authUser.follower.filter((uid) => uid !== userId),
				});
				if (userProfile)
					setUserProfile({
						...userProfile,
						followers: userProfile.followers.filter((uid) => uid !== authUser.uid),
					});

				localStorage.setItem(
					"user-info",
					JSON.stringify({
						...authUser,
						follower: authUser.follower.filter((uid) => uid !== userId),
					})
				);
				setIsFollower(false);
			} else {
				// follow
				setAuthUser({
					...authUser,
					follower: [...authUser.follower, userId],
				});

				if (userProfile)
					setUserProfile({
						...userProfile,
						followers: [...userProfile.followers, authUser.uid],
					});

				localStorage.setItem(
					"user-info",
					JSON.stringify({
						...authUser,
						follower: [...authUser.follower, userId],
					})
				);
				setIsFollower(true);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsUpdating(false);
		}
	};

	useEffect(() => {
		if (authUser) {
			const isFollower = authUser.follower.includes(userId);
			setIsFollower(isFollower);
		}
	}, [authUser, userId]);

	return { isUpdating, isFollower, handleFollowerUser };
};

export default useFollowerUser;
