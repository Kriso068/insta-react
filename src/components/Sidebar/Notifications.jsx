
import { useEffect, useState } from "react";
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
import { Avatar, AvatarBadge, AvatarGroup, Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Tooltip } from "@chakra-ui/react";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const MyMessages = () => {
    const authUser = useAuthStore((state) => state.user);
    const [users, setUsers] = useState([]);
    const [readMessages, setReadMessages] = useState([]); // Local state to track read messages
    const [showModal, setShowModal] = useState(false);
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

                // Mark messages as read by updating each document
                const querySnapshot = await getDocs(q);
                const updatePromises = querySnapshot.docs.map((messageDoc) => {
                    return updateDoc(messageDoc.ref, { unread: false });
                });

                await Promise.all(updatePromises);

                // Update local read state to filter out this user
                setReadMessages((prev) => [...prev, userProfile.uid]);

                // Navigate to the chat page
                navigate(`/message/${authUser?.username}/${userProfile.username}`);
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }
    };

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    useEffect(() => {
        if (!authUser) return;

        const q = query(
            collection(firestore, "privateMessages"),
            where("users", "array-contains", authUser.uid),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const fetchedUsers = {};

            querySnapshot.forEach((doc) => {
                const message = { ...doc.data(), id: doc.id };
                const otherUserUid = message.senderUid === authUser.uid ? message.receiverUid : message.senderUid;

                if (!fetchedUsers[otherUserUid]) {
                    fetchedUsers[otherUserUid] = {
                        userProfile: null,
                        messageCount: 0,
                        latestMessage: message.text,
                    };
                }

                if (message.unread && message.receiverUid === authUser.uid) {
                    fetchedUsers[otherUserUid].messageCount++;
                }
            });

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

    // Filter out users with messages marked as read
    const filteredUsers = users.filter(user => !readMessages.includes(user.userProfile.uid));

    return (
        <>
            <Tooltip
                hasArrow
                label="Unread Messages"
                placement="right"
                openDelay={500}
            >
                <Flex
                    alignItems="center"
                    cursor="pointer"
                    gap={4}
                    p={2}
                    _hover={{ bg: "whiteAlpha.400" }}
                    onClick={openModal}
                >
                    <Box>
                        <svg
                            aria-label="Notifications"
                            height="24"
                            width="24"
                            viewBox="0 0 24 24"
                            fill={filteredUsers.some(user => user.messageCount > 0) ? "red" : "rgb(245, 245, 245)"}
                        >
                            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" />
                        </svg>
                    </Box>
                    <Box display={{ base: "none", md: "block" }}>Notifications</Box>
                </Flex>
            </Tooltip>

            <Modal isOpen={showModal} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Unread Messages</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(({ userProfile, messageCount, latestMessage }) => (
                                <Flex
                                    key={userProfile.uid}
                                    alignItems="center"
                                    gap={3}
                                    p={2}
                                    cursor="pointer"
                                    _hover={{ bg: "gray.600" }}
                                    borderRadius="md"
                                    onClick={() => handleChatboxClick(userProfile)}
                                >
                                    <AvatarGroup>
                                        <Avatar src={userProfile.profilePicURL} alt="profile pic">
                                            {messageCount > 0 && (
                                                <AvatarBadge boxSize="1.25em" bg="red.500" fontSize="0.75em">
                                                    {messageCount}
                                                </AvatarBadge>
                                            )}
                                        </Avatar>
                                    </AvatarGroup>
                                    <Flex direction="column">
                                        <Text fontWeight="bold">{userProfile.username}</Text>
                                        <Text fontSize="sm" color="gray.400">{latestMessage}</Text>
                                    </Flex>
                                </Flex>
                            ))
                        ) : (
                            <Text>No unread messages found.</Text>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default MyMessages;


