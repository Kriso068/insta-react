import { useEffect, useState } from "react"
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { firestore } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";


const useGetFollwigsnByUserId = () => {

    const [isLoading, setIsLoading] = useState(true);
    const {followings , setFollowings} = useUserProfileStore();
    const showToast = useShowToast();
    const userProfile = useUserProfileStore((state) => state.userProfile);

    useEffect(() => {
        const getFollowers = async () =>{
            if(!userProfile) return;
            setIsLoading(true);
            setFollowings([]);

            try {
                const q = query(collection(firestore, "users"), where("following", "array-contains", userProfile.uid));
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

        console.log(followings);
        getFollowers();
        
    },[setFollowings, userProfile, showToast])
    
    return { isLoading, followings}
}

export default useGetFollwigsnByUserId;