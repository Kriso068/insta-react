// import { useEffect, useState } from "react"
// import useShowToast from "./useShowToast";
// import useUserProfileStore from "../store/userProfileStore";
// import { firestore } from "../firebase/firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import useAuthStore from "../store/authStore";


// const useGetFollwersByUserId = () => {

//     const [isLoading, setIsLoading] = useState(true);
//     const {followers , setFollowers} = useUserProfileStore();
//     const showToast = useShowToast();
//     const userProfile = useUserProfileStore((state) => state.userProfile);
//     const authUser = useAuthStore(state => state.user);

//     useEffect(() => {
//         const getFollowers = async () =>{
//             if(!userProfile) return;
//             setIsLoading(true);
//             setFollowers([]);

//             try {
//                 const q = query(collection(firestore, "users"), where("following", "array-contains", authUser.uid));
// 				const querySnapshot = await getDocs(q);

// 				const followers = [];
// 				querySnapshot.forEach((doc) => {
//                     followers.push({ ...doc.data(), id: doc.id });
// 				});

// 				followers.sort((a, b) => b.createdAt - a.createdAt);
// 				setFollowers(followers);
                
                
//             } catch (error) {
// 				showToast("Error", error.message, "error");
// 				setFollowers([]);
// 			} finally {
//                 setIsLoading(false);
// 			}
//         };

//         getFollowers();
//     },[setFollowers, userProfile, showToast])
    
    
//     return { isLoading, followers}
// }

// export default useGetFollwersByUserId;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Get the username from URL
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
                    setFollowers([]); // If user not found, set empty followers
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
