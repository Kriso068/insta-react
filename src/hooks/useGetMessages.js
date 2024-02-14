import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useMessageStore from "../store/useMessageStore";

const useGetMessages = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { messages, setMessages } = useMessageStore();
	const authUser = useAuthStore((state) => state.user);
	const showToast = useShowToast();
	const { setUserProfile } = useUserProfileStore();

	useEffect(() => {
		const getMessages = async () => {
			setIsLoading(true);
			if (authUser.messages.length === 0) {
				setIsLoading(false);
				setMessages([]);
				return;
			}
			const q = query(collection(firestore, "messages"), where("createdBy", "in", authUser.following));
			try {
				const querySnapshot = await getDocs(q);
				const messages = [];

				querySnapshot.forEach((doc) => {
					messages.push({ id: doc.id, ...doc.data() });
				});

				messages.sort((a, b) => b.createdAt - a.createdAt);
				setMessages(messages);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setIsLoading(false);
			}
		};

		if (authUser) getMessages();
	}, [authUser, showToast, setMessages, setUserProfile]);

	return { isLoading, messages };
};

export default useGetMessages;
