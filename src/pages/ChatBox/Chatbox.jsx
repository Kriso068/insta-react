

// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//     query,
//     collection,
//     orderBy,
//     onSnapshot,
//     limit,
//     where,
//     getDocs,
//     updateDoc,
//     doc
// } from "firebase/firestore";
// import { firestore } from "../../firebase/firebase";
// import Message from "../../components/ChatBox/Message";
// import SendMessage from "../../components/ChatBox/SendMessage";
// import ReplyMessage from "../../components/ChatBox/ReplyMessage";
// import '../../components/ChatBox/chatBox.css';
// import useAuthStore from "../../store/authStore";

// const ChatBox = () => {
//     const authUser = useAuthStore((state) => state.user);
//     const [messages, setMessages] = useState([]);
//     const scroll = useRef();
//     const { sender } = useParams();
//     const [senderUserProfile, setsenderUserProfile] = useState(null);

//     useEffect(() => {

//         const fetchsenderUserProfile = async () => {
//             try {
//                 const userQuery = query(collection(firestore, "users"), where("username", "==", sender));
//                 const userSnapshot = await getDocs(userQuery);
//                 if (!userSnapshot.empty) {
//                     userSnapshot.forEach((doc) => {
//                         setsenderUserProfile(doc.data());
//                     });
//                 } else {
//                     console.error("Sender user profile not found.");
//                 }
//             } catch (error) {
//                 console.error("Error fetching sender user profile:", error);
//             }
//         };

//         if (sender) {
//             fetchsenderUserProfile();
//         }

//         return () => {
//             // Cleanup function
//         };
//     }, [sender]);

//     useEffect(() => {
//         if (!authUser || !senderUserProfile) return;

//         const q = query(
//             collection(firestore, "privateMessages"),
//             where("users", "array-contains", [senderUserProfile.uid, authUser.uid]),
//             orderBy("createdAt", "desc"),
//             limit(50)
//         );

//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const fetchedMessages = [];
//             querySnapshot.forEach((doc) => {
//                 fetchedMessages.push({ ...doc.data(), id: doc.id });
//             });
//             const sortedMessages = fetchedMessages.sort((a, b) => a.createdAt - b.createdAt);
//             setMessages(sortedMessages);

//             fetchedMessages.forEach(async (message) => {
//                 if (message.uid === senderUserProfile.uid && message.unread) {
//                     const messageRef = doc(firestore, "privateMessages", message.id);
//                     try {
//                         await updateDoc(messageRef, {
//                             unread: false
//                         });
//                     } catch (error) {
//                         console.error("Error marking message as read:", error);
//                     }
//                 }
//             });
//         });

//         return () => unsubscribe();
//     }, [authUser, senderUserProfile]);

//     return (
//         <main className="chat-box">
//             <div className="messages-wrapper">
//                 {messages.map((message) =>
//                     message && <Message key={message.id} message={message} authUser={authUser} />
//                 )}
//             </div>
//             <span ref={scroll}></span>
//             {messages.length <= 0 ? (
//                 <SendMessage scroll={scroll} authUser={authUser} senderUid={senderUserProfile?.uid} />
//             ) : (
//                 senderUserProfile && (
//                     <ReplyMessage
//                         scroll={scroll}
//                         authUser={authUser}
//                         senderUid={senderUserProfile.uid}
//                     />
//                 )
//             )}
//         </main>
//     );
// };

// export default ChatBox;
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    where,
    getDocs,
    updateDoc,
    doc,
    or
} from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import Message from "../../components/ChatBox/Message";
import SendMessage from "../../components/ChatBox/SendMessage";
import ReplyMessage from "../../components/ChatBox/ReplyMessage";
import '../../components/ChatBox/chatBox.css';
import useAuthStore from "../../store/authStore";

const ChatBox = () => {
    const authUser = useAuthStore((state) => state.user);
    const [messages, setMessages] = useState([]);
    const scroll = useRef();
    const { sender } = useParams();
    const [senderUserProfile, setSenderUserProfile] = useState(null);

    useEffect(() => {

        const fetchSenderUserProfile = async () => {
            try {
                const userQuery = query(collection(firestore, "users"), where("username", "==", sender));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    userSnapshot.forEach((doc) => {
                        setSenderUserProfile(doc.data());
                    });
                } else {
                    console.error("Sender user profile not found.");
                }
            } catch (error) {
                console.error("Error fetching sender user profile:", error);
            }
        };

        if (sender) {
            fetchSenderUserProfile();
        }

        return () => {
            // Cleanup function
        };
    }, [sender]);

    console.log("Sender User Profile:", senderUserProfile);
    console.log("Authenticated User:", authUser);

    useEffect(() => {
        if (!authUser || !senderUserProfile) return;

        const q = query(
            collection(firestore, "privateMessages"),
            where("users", "array-contains", [senderUserProfile.uid, authUser.uid]),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = [];
            querySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort((a, b) => a.createdAt - b.createdAt);
            setMessages(sortedMessages);
            
            fetchedMessages.forEach(async (message) => {
                if (message.uid === senderUserProfile.uid && message.unread) {
                    const messageRef = doc(firestore, "privateMessages", message.id);
                    try {
                        await updateDoc(messageRef, {
                            unread: false
                        });
                    } catch (error) {
                        console.error("Error marking message as read:", error);
                    }
                }
            });
        });
        
        return () => unsubscribe();
    }, [authUser, senderUserProfile]);
    
    console.log(messages)
    return (
        <main className="chat-box">
            <div className="messages-wrapper">
                {messages.map((message) =>
                    message && <Message key={message.id} message={message} authUser={authUser} />
                )}
            </div>
            <span ref={scroll}></span>
            {messages.length <= 0 ? (
                <SendMessage scroll={scroll} authUser={authUser} receiverUid={senderUserProfile?.uid} />
            ) : (
                senderUserProfile && (
                    <ReplyMessage
                        scroll={scroll}
                        authUser={authUser}
                        receiverUid={senderUserProfile.uid}
                    />
                )
            )}
        </main>
    );
};

export default ChatBox;
