
import { useEffect, useRef, useState } from "react";
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    where
} from "firebase/firestore";


import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";
import Message from "../../components/ChatBox/Message";
import SendMessage from "../../components/ChatBox/SendMessage";
import useUserProfileStore from "../../store/userProfileStore";
import ReplyMessage from "../../components/ChatBox/ReplyMessage";
import '../../components/ChatBox/chatBox.css';

const ChatBox = () => {
  const authUser = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const scroll = useRef();
  const { userProfile } = useUserProfileStore();
 
    useEffect(() => {
        if (!authUser || !userProfile) return;
      
        const users = [authUser?.uid, userProfile?.uid];
      
        const q = query(
            collection(firestore, "privateMessages"),
            where("users", "array-contains-any", users), 
            orderBy("createdAt", "desc"),
            limit(50)
        );
      
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = [];
            querySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.createdAt - b.createdAt
            );
          setMessages(sortedMessages);
        });
      
        return () => unsubscribe();
    }, [authUser, userProfile]);

    return (
        <main className="chat-box">
            <div className="messages-wrapper">
                {messages.map((message) => (
                    (message.users.includes(authUser.uid) && message.users.includes(userProfile.uid)) ? (
                        <Message key={`${message.id}-${message.uid}`} message={message} authUser={authUser} />
                    ) : null
                ))}
                
            </div>
            <span ref={scroll}></span>
            {messages.length > 0 ? (
                (messages[0].users.includes(authUser.uid) && messages[0].users.includes(userProfile.uid)) ? (
                    <ReplyMessage
                        scroll={scroll}
                        authUser={authUser}
                        senderUid={
                            messages[0].users[0] === authUser.uid ? messages[0].users[1] : messages[0].users[0]
                        }
                    />
                ) : (
                    <SendMessage scroll={scroll} authUser={authUser} userProfileUid={userProfile?.uid} />
                )
            ) : (
                <SendMessage scroll={scroll} authUser={authUser} userProfileUid={userProfile?.uid} />
            )}

        </main>
    );
};

export default ChatBox;