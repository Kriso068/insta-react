
// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//     query,
//     collection,
//     orderBy,
//     onSnapshot,
//     where,
//     getDocs,
//     doc,
//     deleteDoc,
//     updateDoc
// } from "firebase/firestore";
// import { firestore } from "../../firebase/firebase";
// import Message from "../../components/ChatBox/Message";
// import MessageForm from "../../components/ChatBox/MessageForm";
// import '../../components/ChatBox/chatBox.css';
// import useAuthStore from "../../store/authStore";

// const ChatBox = () => {
//     const authUser = useAuthStore((state) => state.user);
//     const [messages, setMessages] = useState([]);
//     const scroll = useRef();
//     const { sender } = useParams();
//     const [senderUserProfile, setSenderUserProfile] = useState(null);
//     const [editingMessage, setEditingMessage] = useState(null);
//     const [editText, setEditText] = useState("");

//     // Fetch sender's profile
//     useEffect(() => {
//         const fetchSenderUserProfile = async () => {
//             try {
//                 const userQuery = query(collection(firestore, "users"), where("username", "==", sender));
//                 const userSnapshot = await getDocs(userQuery);

//                 if (!userSnapshot.empty) {
//                     const userData = userSnapshot.docs[0].data();
//                     setSenderUserProfile(userData);
//                 } else {
//                     console.error("Sender user profile not found.");
//                 }
//             } catch (error) {
//                 console.error("Error fetching sender user profile:", error);
//             }
//         };

//         if (sender) fetchSenderUserProfile();
//     }, [sender]);

//     // Fetch and listen to messages
//     useEffect(() => {
//         if (!authUser || !senderUserProfile) return;

//         const q = query(
//             collection(firestore, "privateMessages"),
//             where("users", "array-contains", authUser.uid),
//             orderBy("createdAt", "desc")
//         );

//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const fetchedMessages = [];
//             querySnapshot.forEach((doc) => {
//                 fetchedMessages.push({ ...doc.data(), id: doc.id });
//             });

//             setMessages(fetchedMessages.sort((a, b) => a.createdAt - b.createdAt));
//             scroll.current?.scrollIntoView({ behavior: "smooth" });
//         });

//         return () => unsubscribe();
//     }, [authUser, senderUserProfile]);

//     // Delete a message
//     const deleteMessage = async (messageId) => {
//         try {
//             await deleteDoc(doc(firestore, "privateMessages", messageId));
//             setMessages((prev) => prev.filter((message) => message.id !== messageId));
//         } catch (error) {
//             console.error("Error deleting message:", error);
//         }
//     };

//     // Start editing a message
//     const startEditing = (message) => {
//         setEditingMessage(message.id);
//         setEditText(message.text);
//     };

//     // Cancel editing
//     const cancelEditing = () => {
//         setEditingMessage(null);
//         setEditText("");
//     };

//     // Update (edit) a message
//     const editMessage = async () => {
//         if (!editText.trim()) {
//             alert("Message cannot be empty.");
//             return;
//         }

//         try {
//             await updateDoc(doc(firestore, "privateMessages", editingMessage), { text: editText });
//             setMessages((prev) =>
//                 prev.map((message) =>
//                     message.id === editingMessage ? { ...message, text: editText } : message
//                 )
//             );
//             cancelEditing();
//         } catch (error) {
//             console.error("Error editing message:", error);
//         }
//     };

//     return (
//         <main className="chat-box">
//             <div className="messages-wrapper">
//                 {messages.map((message) => (
//                     <Message
//                         key={message.id}
//                         message={message}
//                         authUser={authUser}
//                         onEdit={startEditing}
//                         onDelete={deleteMessage}
//                         isEditing={editingMessage === message.id}
//                         editText={editText}
//                         setEditText={setEditText}
//                         editMessage={editMessage}
//                         cancelEditing={cancelEditing}
//                     />
//                 ))}
//             </div>
//             <span ref={scroll}></span>
//             {senderUserProfile && (
//                 <MessageForm
//                     scroll={scroll}
//                     authUser={authUser}
//                     receiverUid={senderUserProfile.uid}
//                     buttonText={messages.length <= 0 ? "Send" : "Reply"}
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
    where,
    getDocs,
    doc,
    deleteDoc,
    updateDoc
} from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import Message from "../../components/ChatBox/Message";
import MessageForm from "../../components/ChatBox/MessageForm";
import '../../components/ChatBox/chatBox.css';
import useAuthStore from "../../store/authStore";

const ChatBox = () => {
    const authUser = useAuthStore((state) => state.user);
    const { sender } = useParams();
    const [messages, setMessages] = useState([]);
    const [senderUserProfile, setSenderUserProfile] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editText, setEditText] = useState("");
    const scroll = useRef();

    useEffect(() => {
        const fetchSenderUserProfile = async () => {
            try {
                const userQuery = query(
                    collection(firestore, "users"),
                    where("username", "==", sender)
                );
                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                    setSenderUserProfile(userSnapshot.docs[0].data());
                } else {
                    console.error("Sender user profile not found.");
                }
            } catch (error) {
                console.error("Error fetching sender user profile:", error);
            }
        };

        if (sender) fetchSenderUserProfile();
    }, [sender]);

    useEffect(() => {
        if (!authUser || !senderUserProfile) return;

        const q = query(
            collection(firestore, "privateMessages"),
            where("users", "in", [[authUser.uid, senderUserProfile.uid], [senderUserProfile.uid, authUser.uid]]),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setMessages(fetchedMessages.reverse());
            scroll.current?.scrollIntoView({ behavior: "smooth" });
        });

        return () => unsubscribe();
    }, [authUser, senderUserProfile]);

    // Delete a message
    const deleteMessage = async (messageId) => {
        try {
            await deleteDoc(doc(firestore, "privateMessages", messageId));
            setMessages((prev) => prev.filter((message) => message.id !== messageId));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    // Start editing a message
    const startEditing = (message) => {
        setEditingMessage(message.id);
        setEditText(message.text);
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingMessage(null);
        setEditText("");
    };

    // Update (edit) a message
    const editMessage = async () => {
        if (!editText.trim()) {
            alert("Message cannot be empty.");
            return;
        }

        try {
            await updateDoc(doc(firestore, "privateMessages", editingMessage), { text: editText });
            setMessages((prev) =>
                prev.map((message) =>
                    message.id === editingMessage ? { ...message, text: editText } : message
                )
            );
            cancelEditing();
        } catch (error) {
            console.error("Error editing message:", error);
        }
    };

    return (
        <main className="chat-box">
            <div className="messages-wrapper">
                {messages.map((message) => (
                    <Message
                    key={message.id}
                    message={message}
                    authUser={authUser}
                    onEdit={startEditing}
                    onDelete={deleteMessage}
                    isEditing={editingMessage === message.id}
                    editText={editText}
                    setEditText={setEditText}
                    editMessage={editMessage}
                    cancelEditing={cancelEditing} />
                ))}
            </div>
            <span ref={scroll}></span>
            {senderUserProfile && (
                <MessageForm
                    scroll={scroll}
                    authUser={authUser}
                    receiverUid={senderUserProfile.uid}
                    buttonText={messages.length <= 0 ? "Send" : "Reply"}
                />
            )}
        </main>
    );
};

export default ChatBox;
