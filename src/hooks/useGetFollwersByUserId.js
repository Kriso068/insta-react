import { useEffect, useState } from "react"
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { firestore } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import useAuthStore from "../store/authStore";


const useGetFollwersByUserId = () => {

    const [isLoading, setIsLoading] = useState(true);
    const {followers , setFollowers} = useUserProfileStore();
    const showToast = useShowToast();
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const authUser = useAuthStore(state => state.user);

    useEffect(() => {
        const getFollowers = async () =>{
            if(!userProfile) return;
            setIsLoading(true);
            setFollowers([]);

            try {
                const q = query(collection(firestore, "users"), where("following", "array-contains", authUser.uid));
				const querySnapshot = await getDocs(q);

				const followers = [];
				querySnapshot.forEach((doc) => {
                    followers.push({ ...doc.data(), id: doc.id });
				});

				followers.sort((a, b) => b.createdAt - a.createdAt);
				setFollowers(followers);
                
                
            } catch (error) {
				showToast("Error", error.message, "error");
				setFollowers([]);
			} finally {
                setIsLoading(false);
			}
        };

        getFollowers();
    },[setFollowers, userProfile, showToast])
    
    useEffect(() => {
        console.log('My followers:', followers);
      }, [followers]);
    
    return { isLoading, followers}
}

export default useGetFollwersByUserId;