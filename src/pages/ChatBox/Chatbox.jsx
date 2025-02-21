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
    const lastMessageRef = useRef(null);
    

    const messagesWrapperRef = useRef(null);
    const [showForm, setShowForm] = useState(true);
    const lastScrollTop = useRef(0);


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


            // Scroll to bottom when new messages arrive
            setTimeout(() => {
                if (messagesWrapperRef.current) {
                    messagesWrapperRef.current.scrollTop = messagesWrapperRef.current.scrollHeight;
                }
            }, 100);
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

    // ✅ Fixed scroll detection logic
    useEffect(() => {
        const handleScroll = () => {
            if (!messagesWrapperRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = messagesWrapperRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // Small margin for precision

            // Detecting user scroll direction
            if (scrollTop > lastScrollTop.current) {
                setShowForm(false); // Scrolling UP → Hide MessageForm
            } else if (isAtBottom) {
                setShowForm(true); // At bottom → Show MessageForm
            }

            lastScrollTop.current = scrollTop; // Store last scroll position
        };

        const messagesDiv = messagesWrapperRef.current;
        if (messagesDiv) {
            messagesDiv.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (messagesDiv) {
                messagesDiv.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);
    

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
    const userLastMessage = messages
        .filter((msg) => msg.senderUid === authUser.uid)
        .reduce((latest, msg) => (!latest || msg.createdAt > latest.createdAt ? msg : latest), null);


    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [messages]);


    return (
        <main className="chat-box">
            <div ref={messagesWrapperRef} className="messages-wrapper">
                {messages.map((message, index) => (
                    <div key={message.id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                        <Message
                            message={message}
                            authUser={authUser}
                            onEdit={startEditing}
                            onDelete={deleteMessage}
                            isEditing={editingMessage === message.id}
                            editText={editText}
                            setEditText={setEditText}
                            editMessage={editMessage}
                            cancelEditing={cancelEditing} 
                            isLastMessage={userLastMessage?.id === message.id}
                        />
                    </div>
                ))}
            </div>
            <span ref={scroll}></span>
            {senderUserProfile && showForm && (
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
