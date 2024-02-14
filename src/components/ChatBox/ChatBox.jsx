import React from 'react'
import useGetMessages from '../../hooks/useGetMessages';
import SendMessage from './SendMessage';

const ChatBox = () => {

    const [messages, isLoading] = useGetMessages();

    const scroll = useRef();


  return (
    
    <div>

        <span ref={scroll}></span>
          <SendMessage scroll={scroll} />
       
    </div>
  )
}

export default ChatBox;



function useCreatePost() {
	const showToast = useShowToast();
	const [isLoading, setIsLoading] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const createPost = usePostStore((state) => state.createPost);
	const addPost = useUserProfileStore((state) => state.addPost);
	const userProfile = useUserProfileStore((state) => state.userProfile);
	const { pathname } = useLocation();

	
	const handleCreateMessage = async (message) => {
		if (isLoading) return;
		if (!message) throw new Error("Enter valid message");
		setIsLoading(true);

		
	
		try {
			const newMessage = {
                text: message,
				createdAt: Date.now(),
				createdBy: authUser.uid,
			};
	
			const messageDocRef = await addDoc(collection(firestore, "messages"), newmessage);
			const userDocRef = doc(firestore, "users", authUser.uid);
	
			await updateDoc(userDocRef, { messages: arrayUnion(messageDocRef.id) });
	
			// if (message) {
			// 	const imageRef = ref(storage, `messages/${messageDocRef.id}`);
			// 	await uploadString(imageRef, message, "data_url");
			// 	const imageURL = await getDownloadURL(imageRef);
			// 	await updateDoc(messageDocRef, { imageURL: imageURL });
			// }
	
			
			if (userProfile.uid === authUser.uid) createMessage({ ...newMessage, id: messageDocRef.id });
	
			// if (pathname !== "/" && userProfile.uid === authUser.uid) addmessage({ ...newMessage, id: messageDocRef.id });
	
			// showToast("Success", "message created successfully", "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleCreateMessage };
}