
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

const useGetFollowingsByUserId = () => {
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [followings, setFollowings] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        const getFollowings = async () => {
            if (!username) return;
            setIsLoading(true);
            setFollowings([]);

            try {
                // First, get user details by username
                const usersRef = collection(firestore, "users");
                const userQuery = query(usersRef, where("username", "==", username));
                const userSnapshot = await getDocs(userQuery);

                if (userSnapshot.empty) {
                   
                    setFollowings([]);
                    setIsLoading(false);
                    return;
                }

                const userProfile = userSnapshot.docs[0].data();
                const userId = userProfile.uid; 

                if (!userProfile.following || userProfile.following.length === 0) {
                    setFollowings([]);
                    setIsLoading(false);
                    return;
                }

                // Fetch following user profiles based on stored UIDs
                const followingList = [];
                for (const followingId of userProfile.following) {
                    const followingRef = doc(firestore, "users", followingId);
                    const followingSnap = await getDoc(followingRef);
                    if (followingSnap.exists()) {
                        followingList.push({ ...followingSnap.data(), id: followingId });
                    } 
                }

                // Sort followings by creation date (most recent first)
                followingList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
               

                setFollowings(followingList);

            } catch (error) {
                showToast("Error", error.message, "error");
                setFollowings([]);
            } finally {
                setIsLoading(false);
            }
        };

        getFollowings();
    }, [username, showToast]);

    return { isLoading, followings };
};

export default useGetFollowingsByUserId;
