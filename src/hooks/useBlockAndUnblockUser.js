import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const useBlockAndUnblockUser = (userId) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const { userProfile, setUserProfile } = useUserProfileStore();
  const showToast = useShowToast();

  const handleBlockUser = async () => {
    setIsUpdating(true);
    try {
      const currentUserRef = doc(firestore, "users", authUser.uid);
      const userToBlockOrUnblockRef = doc(firestore, "users", userId);
      await updateDoc(currentUserRef, {
        blockedUsers: isBlocked ? arrayRemove(userId) : arrayUnion(userId),
      });

      if (isBlocked) {
        // unblock
        setAuthUser({
          ...authUser,
          blockedUsers: authUser.blockedUsers.filter((uid) => uid !== userId),
        });

        if (userProfile)
          setUserProfile({
            ...userProfile,
            blockedUsers: userProfile.blockedUsers.filter((uid) => uid !== userId),
          });

        setIsBlocked(false);
      } else {
        // block
        setAuthUser({
          ...authUser,
          blockedUsers: [...authUser.blockedUsers, userId],
        });

        if (userProfile)
          setUserProfile({
            ...userProfile,
            blockedUsers: [...userProfile.blockedUsers, userId],
          });

        setIsBlocked(true);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      const isBlocked = authUser.blockedUsers.includes(userId);
      setIsBlocked(isBlocked);
    }
  }, [authUser, userId]);

  return { isUpdating, isBlocked, handleBlockUser };
};

export default useBlockAndUnblockUser;
