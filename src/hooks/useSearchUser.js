import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where, orderBy, startAt, endAt } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const showToast = useShowToast();

  const getUserProfile = async (username) => {
    setIsLoading(true);
    setUser(null);
    try {
      // Convert the search query to lowercase and uppercase for case-insensitive search
      const lowercaseUsername = username.toLowerCase();
      const uppercaseUsername = username.toUpperCase();

      // Use orderBy and startAt/endAt for case-insensitive search
      const q = query(
        collection(firestore, "users"),
        orderBy("username"),
        startAt(lowercaseUsername),
        endAt(lowercaseUsername + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return showToast("Error", "User not found", "error");

      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      showToast("Error", error.message, "error");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getUserProfile, user, setUser };
};

export default useSearchUser;
