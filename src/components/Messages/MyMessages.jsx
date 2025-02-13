
import { useEffect, useRef, useState } from "react";
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    where,
    getDoc,
    doc,
    updateDoc,
    getDocs
} from "firebase/firestore";
import { Avatar, AvatarBadge, AvatarGroup, Flex, Text } from "@chakra-ui/react";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import '../../components/ChatBox/chatBox.css';

const MyMessages = () => {
    const authUser = useAuthStore((state) => state.user);
    const [users, setUsers] = useState([]);
    const scroll = useRef();
    const navigate = useNavigate();

    const handleChatboxClick = async (userProfile) => {
        if (userProfile) {
            try {
                // Query to get all unread messages from the selected user
                const q = query(
                    collection(firestore, "privateMessages"),
                    where("users", "array-contains", authUser.uid),
                    where("senderUid", "==", userProfile.uid),
                    where("unread", "==", true)
                );

                // Mark messages as read
                const querySnapshot = await getDocs(q);
                const updatePromises = querySnapshot.docs.map((messageDoc) => {
                    return updateDoc(messageDoc.ref, { unread: false });
                });

                await Promise.all(updatePromises);

                // Update state to remove unread badge for this user
                setUsers((prevUsers) => {
                    return prevUsers.map((user) => {
                        if (user.userProfile.uid === userProfile.uid) {
                            return { ...user, messageCount: 0 }; // Set message count to 0
                        }
                        return user;
                    });
                });

                // Navigate to the message page
                navigate(`/message/${authUser?.username}/${userProfile.username}`);
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }
    };

    useEffect(() => {
        if (!authUser) return;

        // Query to fetch all messages involving the current user
        const q = query(
            collection(firestore, "privateMessages"),
            where("users", "array-contains", authUser.uid),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const fetchedUsers = {};

            // Process each message
            querySnapshot.forEach((doc) => {
                const message = { ...doc.data(), id: doc.id };
                const otherUserUid = message.senderUid === authUser.uid ? message.receiverUid : message.senderUid;

                if (!fetchedUsers[otherUserUid]) {
                    fetchedUsers[otherUserUid] = {
                        userProfile: null,
                        messageCount: 0,
                        
                    };
                }


                // Increment message count for unread messages where the current user is the receiver
                if (message.unread && message.receiverUid === authUser.uid) {
                    fetchedUsers[otherUserUid].messageCount++;
                }
            });

            // Fetch user profiles for each user involved in the conversation
            for (const userUid of Object.keys(fetchedUsers)) {
                try {
                    const userRef = await getDoc(doc(firestore, "users", userUid));
                    if (userRef.exists()) {
                        fetchedUsers[userUid].userProfile = userRef.data();
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error.message);
                }
            }

            // Update state with fetched users and messages
            setUsers(Object.values(fetchedUsers));
        });

        return () => unsubscribe();
    }, [authUser]);

    return (
        <main className="chat-box">
            <div className="messages-wrapper">
                {users.length > 0 ? (
                    users.map(({ userProfile, messageCount, latestMessage }) => (
                        <div 
                            onClick={() => handleChatboxClick(userProfile)}
                            key={userProfile.uid}
                        >
                            <Flex 
                                alignItems="center"
                                gap={3}
                                cursor="pointer"
                                _hover={{ bg: "gray.700" }}
                                p={2}
                                borderRadius="md"
                            >
                                <AvatarGroup>
                                    <Avatar src={userProfile.profilePicURL} alt="profile pic">
                                        {messageCount > 0 && (
                                            <AvatarBadge boxSize="1.25em" bg="red.500" fontSize="0.75em" position="absolute" top="-2" right="-2">
                                                {messageCount}
                                            </AvatarBadge>
                                        )}
                                    </Avatar>
                                </AvatarGroup>
                                <Flex direction="column">
                                    <Text fontWeight="bold">{userProfile.username}</Text>
                                </Flex>
                            </Flex>
                        </div>
                    ))
                ) : (
                    <Text>No messages found.</Text>
                )}
            </div>
            <span ref={scroll}></span>
        </main>
    );
};

export default MyMessages;
