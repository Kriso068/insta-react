import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const useGetFollowersByUserId = () => {
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        const getFollowers = async () => {
            if (!username) return;
            setIsLoading(true);
            setFollowers([]);

            try {
                // First, get user details by username
                const usersRef = collection(firestore, "users");
                const userQuery = query(usersRef, where("username", "==", username));
                const userSnapshot = await getDocs(userQuery);

                if (userSnapshot.empty) {
                    setFollowers([]); 
                    setIsLoading(false);
                    return;
                }

                const userProfile = userSnapshot.docs[0].data();
                const userId = userProfile.uid; 

                // Fetch followers of this userId
                const followersQuery = query(collection(firestore, "users"), where("following", "array-contains", userId));
                const followersSnapshot = await getDocs(followersQuery);

                
                const followersList = [];
                followersSnapshot.forEach((doc) => {
                    followersList.push({ ...doc.data(), id: doc.id });
                });

                // Sort followers by creation date (most recent first)
                followersList.sort((a, b) => b.createdAt - a.createdAt);
                setFollowers(followersList);

            } catch (error) {
                showToast("Error", error.message, "error");
                setFollowers([]);
            } finally {
                setIsLoading(false);
            }
        };

        getFollowers();
    }, [username, showToast]);

    return { isLoading, followers };
};

export default useGetFollowersByUserId;
