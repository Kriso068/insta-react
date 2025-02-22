

import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { arrayRemove, arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useLikePost = (post) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?.uid));
    const [likedUsers, setLikedUsers] = useState([]);
    const showToast = useShowToast();

    // Fetch liked users' profiles
    useEffect(() => {
        const fetchLikedUsers = async () => {
            try {
                const usersData = await Promise.all(
                    post.likes.map(async (userId) => {
                        const userRef = doc(firestore, "users", userId);
                        const userSnapshot = await getDoc(userRef);
                        return userSnapshot.exists() ? { uid: userId, ...userSnapshot.data() } : null;
                    })
                );
                setLikedUsers(usersData.filter(user => user !== null));
            } catch (error) {
                showToast("Error", error.message, "error");
            }
        };

        if (post.likes.length > 0) {
            fetchLikedUsers();
        }
    }, [post.likes, showToast]);

    const handleLikePost = async () => {
        if (isUpdating) return;
        if (!authUser) return showToast("Error", "You must be logged in to like a post", "error");
        setIsUpdating(true);

        try {
            const postRef = doc(firestore, "posts", post.id);
            const newLike = authUser.uid;
            
            await updateDoc(postRef, {
                likes: isLiked ? arrayRemove(newLike) : arrayUnion(newLike),
            });

            setIsLiked(!isLiked);
            setLikes((prevLikes) =>
                isLiked ? prevLikes.filter((id) => id !== newLike) : [...prevLikes, newLike]
            );
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsUpdating(false);
        }
    };

    return { isLiked, likes: likes.length, likedUsers, handleLikePost, isUpdating };
};

export default useLikePost;
