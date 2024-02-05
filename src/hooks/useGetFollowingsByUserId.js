import { useEffect, useState } from "react"
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { firestore } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import useAuthStore from "../store/authStore";


const useGetFollwingsByUserId = () => {

    const [isLoading, setIsLoading] = useState(true);
    const {followings , setFollowings} = useUserProfileStore();
    const showToast = useShowToast();
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const authUser = useAuthStore(state => state.user);



    useEffect(() => {
        const getFollowings = async () =>{
            if(!userProfile) return;
            setIsLoading(true);
            setFollowings([]);

            try {
                const q = query(collection(firestore, "users"), where("followers", "array-contains", authUser.uid));
				const querySnapshot = await getDocs(q);

				const followings = [];
				querySnapshot.forEach((doc) => {
                    followings.push({ ...doc.data(), id: doc.id });
				});

				followings.sort((a, b) => b.createdAt - a.createdAt);
				setFollowings(followings);
                
            } catch (error) {
				showToast("Error", error.message, "error");
				setFollowings([]);
			} finally {
                setIsLoading(false);
			}
        };

        getFollowings();
        
    },[setFollowings, userProfile, showToast])
    
    return { isLoading, followings}
}

export default useGetFollwingsByUserId;