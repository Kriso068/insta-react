
// // import { useEffect, useRef, useState } from "react";
// // import {
// //     query,
// //     collection,
// //     orderBy,
// //     onSnapshot,
// //     limit,
// //     where
// // } from "firebase/firestore";


// // import { firestore } from "../../firebase/firebase";
// // import useAuthStore from "../../store/authStore";
// // import Message from "../../components/ChatBox/Message";
// // import SendMessage from "../../components/ChatBox/SendMessage";
// // import useUserProfileStore from "../../store/userProfileStore";
// // import ReplyMessage from "../../components/ChatBox/ReplyMessage";
// // import '../../components/ChatBox/chatBox.css';
// // import { useParams } from "react-router-dom";

// // const ChatBox = () => {
// //   const authUser = useAuthStore((state) => state.user);
// //   const [messages, setMessages] = useState([]);
// //   const scroll = useRef();
// //   const  sender  = useParams(':sender');
// //   console.log(sender);

// //     useEffect(() => {
// //         if (!authUser || !senderUserProfile) return;
      
// //         const users = [authUser?.uid, senderUserProfile?.uid];
      
// //         const q = query(
// //             collection(firestore, "privateMessages"),
// //             where("users", "array-contains-any", users), 
// //             orderBy("createdAt", "desc"),
// //             limit(50)
// //         );
      
// //         const unsubscribe = onSnapshot(q, (querySnapshot) => {
// //             const fetchedMessages = [];
// //             querySnapshot.forEach((doc) => {
// //                 fetchedMessages.push({ ...doc.data(), id: doc.id });
// //             });
// //             const sortedMessages = fetchedMessages.sort(
// //                 (a, b) => a.createdAt - b.createdAt
// //             );
// //           setMessages(sortedMessages);
// //         });
      
// //         return () => unsubscribe();
// //     }, [authUser, senderUserProfile]);

// //     // console.log(messages);
// //     // console.log(authUser);
// //     return (
// //         <main className="chat-box">
// //             <div className="messages-wrapper">
// //                 {messages.map((message) => (
// //                     (message.users.includes(authUser.uid) && message.users.includes(senderUserProfile.uid)) ? (
// //                         <Message key={`${message.id}-${message.uid}`} message={message} authUser={authUser} />
// //                     ) : null
// //                 ))}
                
// //             </div>
// //             <span ref={scroll}></span>
// //             {messages.length > 0 ? (
// //                 (messages[0].users.includes(authUser.uid) && messages[0].users.includes(senderUserProfile.uid)) ? (
// //                     <ReplyMessage
// //                         scroll={scroll}
// //                         authUser={authUser}
// //                         senderUid={
// //                             messages[0].users[0] === authUser.uid ? messages[0].users[1] : messages[0].users[0]
// //                         }
// //                     />
// //                 ) : (
// //                     <SendMessage scroll={scroll} authUser={authUser} userProfileUid={senderUserProfile?.uid} />
// //                 )
// //             ) : (
// //                 <SendMessage scroll={scroll} authUser={authUser} userProfileUid={senderUserProfile?.uid} />
// //             )}

// //         </main>
// //     );
// // };

// // export default ChatBox;
// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//     query,
//     collection,
//     orderBy,
//     onSnapshot,
//     limit,
//     where,
//     getDoc,
//     doc
// } from "firebase/firestore";
// import { firestore } from "../../firebase/firebase";
// import useAuthStore from "../../store/authStore";
// import Message from "../../components/ChatBox/Message";
// import SendMessage from "../../components/ChatBox/SendMessage";
// import ReplyMessage from "../../components/ChatBox/ReplyMessage";
// import '../../components/ChatBox/chatBox.css';
// import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";

// const ChatBox = () => {
//     const authUser = useAuthStore((state) => state.user);
//     const [messages, setMessages] = useState([]);
//     const scroll = useRef();
//     const { sender } = useParams();
    
//     // console.log(userProfile);
//     console.log(sender);
//     // const [isLoading, userProfile] = useGetUserProfileByUsername(sender);
//     useEffect(() => {
//         if (!authUser || !sender) return;

//         const fetchSenderUserProfile = async () => {
//             try {
//                 const userDoc = await getDoc(doc(firestore, "users", sender));
//                 if (userDoc.exists()) {
//                     setSenderUserProfile(userDoc.data());
//                 } else {
//                     console.error("Sender user profile not found.");
//                 }
//             } catch (error) {
//                 console.error("Error fetching sender user profile:", error);
//             }
//         };

//         fetchSenderUserProfile();

//         const q = query(
//             collection(firestore, "privateMessages"),
//             where("users", "array-contains", sender), // Assuming 'sender' is the user ID
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
//         });

//         return () => unsubscribe();
//     }, [authUser, sender]);

//     return (
//         <main className="chat-box">
//             <div className="messages-wrapper">
//                 {messages.map((message) =>
//                     message && <Message key={message.id} message={message} authUser={authUser} />
//                 )}
//             </div>
//             <span ref={scroll}></span>
//             <SendMessage scroll={scroll} authUser={authUser} userProfileUid={sender} />
//             {/* Assuming `sender` is the user ID */}
//             {senderUserProfile && (
//                 <ReplyMessage
//                     scroll={scroll}
//                     authUser={authUser}
//                     senderUid={sender}
//                     userProfileUid={senderUserProfile.uid}
//                 />
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
    getDocs
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
            // You can add any cleanup logic here
        };
    }, [sender]);

    console.log(senderUserProfile);
    useEffect(() => {
        if (!authUser || !senderUserProfile) return;

        const q = query(
            collection(firestore, "privateMessages"),
            where("users", "array-contains", senderUserProfile.uid),
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
        });

        return () => unsubscribe();
    }, [authUser, senderUserProfile]);

    return (
        <main className="chat-box">
            <div className="messages-wrapper">
                {messages.map((message) =>
                    message && <Message key={message.id} message={message} authUser={authUser} />
                )}
            </div>
            <span ref={scroll}></span>
            <SendMessage scroll={scroll} authUser={authUser} userProfileUid={sender} />
            {senderUserProfile && (
                <ReplyMessage
                    scroll={scroll}
                    authUser={authUser}
                    senderUid={sender}
                    userProfileUid={senderUserProfile.uid}
                />
            )}
        </main>
    );
};

export default ChatBox;

