
import { useEffect, useState } from "react";
import {
    query,
    collection,
    orderBy,
    onSnapshot,
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
    const navigate = useNavigate();

    const handleChatboxClick = async (userProfile) => {
        if (!userProfile) return;

        try {
            // Query unread messages from selected user
            const q = query(
                collection(firestore, "privateMessages"),
                where("users", "array-contains", authUser.uid),
                where("senderUid", "==", userProfile.uid),
                where("unread", "==", true)
            );

            // Mark messages as read
            const querySnapshot = await getDocs(q);
            const updatePromises = querySnapshot.docs.map((messageDoc) =>
                updateDoc(messageDoc.ref, { unread: false })
            );
            await Promise.all(updatePromises);

            // Update state to remove unread badge for this user
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userProfile.uid === userProfile.uid ? { ...user, messageCount: 0 } : user
                )
            );

            // Navigate to the chat
            navigate(`/message/${authUser?.username}/${userProfile.username}`);
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    useEffect(() => {
        if (!authUser) return;

        // Query messages where the current user is involved
        const q = query(
            collection(firestore, "privateMessages"),
            where("users", "array-contains", authUser.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const fetchedUsers = {};

            querySnapshot.forEach((doc) => {
                const message = { ...doc.data(), id: doc.id };
                const otherUserUid =
                    message.senderUid === authUser.uid ? message.receiverUid : message.senderUid;

                if (!fetchedUsers[otherUserUid]) {
                    fetchedUsers[otherUserUid] = {
                        userProfile: null,
                        messageCount: 0
                    };
                }

                if (message.unread && message.receiverUid === authUser.uid) {
                    fetchedUsers[otherUserUid].messageCount++;
                }
            });

            // Fetch user profiles
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

            setUsers(Object.values(fetchedUsers));
        });

        return () => unsubscribe();
    }, [authUser]);

    return (
        <main className="chat-box">
            <div className="messages-wrapper">
                {users.length > 0 ? (
                    users.map(({ userProfile, messageCount }) => (
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
                                            <AvatarBadge
                                                boxSize="1.25em"
                                                bg="red.500"
                                                fontSize="0.75em"
                                            >
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
        </main>
    );
};

export default MyMessages;

