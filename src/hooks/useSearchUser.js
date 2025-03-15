import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, orderBy, startAt, endAt, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const showToast = useShowToast();

  const getUserProfile = async (username) => {
    setIsLoading(true);
    setUsers([]);

    try {
      if (!username.trim()) return;

      const searchQuery = username.trim().toLowerCase(); 

      const q = query(
        collection(firestore, "users"),
        orderBy("usernameLower"), 
        startAt(searchQuery),
        endAt(searchQuery + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        showToast("Error", "No users found", "error");
        return;
      }

      const filteredUsers = querySnapshot.docs
        .map(doc => ({ uid: doc.id, ...doc.data() }))
        .slice(0, 10);

      setUsers(filteredUsers);
      
    } catch (error) {
      showToast("Error", error.message, "error");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getUserProfile, users, setUsers };
};

export default useSearchUser;
