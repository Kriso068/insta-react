
import { useEffect, useState } from "react";
import { query, collection, where, orderBy, getDocs, getDoc, doc, limit } from "firebase/firestore";
import { Avatar, AvatarGroup, Box, Flex, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tooltip } from "@chakra-ui/react";
import { NotificationsLogo } from "../../assets/constants";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";
import { Link as RouterLink } from "react-router-dom";

const Notifications = () => {
    const [showModal, setShowModal] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [senderUserProfile, setSenderUserProfile] = useState(null);
    const [selectedMessageUid, setSelectedMessageUid] = useState(null);
    const authUser = useAuthStore((state) => state.user);

    useEffect(() => {
        if (authUser) {
            fetchUnreadMessages();
        }
    }, [authUser]);

    const fetchUnreadMessages = async () => {
        try {
            const q = query(
                collection(firestore, "privateMessages"),
                where("users", "array-contains", authUser.uid),
                where("unread", "==", true),
                orderBy("createdAt", "desc")
            );
    
            const querySnapshot = await getDocs(q);
            const unreadMessagesData = {};
            querySnapshot.forEach((doc) => {
                const message = { id: doc.id, ...doc.data() };
                const senderUid = message.senderUid;
                // Check if the sender UID is different from the authenticated user's UID
                if (senderUid !== authUser.uid && !unreadMessagesData[senderUid]) {
                    unreadMessagesData[senderUid] = message;
                }
            });
    
            setUnreadMessages(Object.values(unreadMessagesData));
        } catch (error) {
            console.error("Error fetching unread messages:", error);
        }
    };

    const handleNotificationClick = () => {
        setShowModal(true);
        fetchUnreadMessages();
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleViewMessage = async (senderUid) => {
        try {
            const userRef = await getDoc(doc(firestore, "users", senderUid));
            if (userRef.exists()) {
                setSenderUserProfile(userRef.data());
                setShowModal(false);
            }
        } catch (error) {
            console.error("Error", error.message);
        }
    };
    

    const handleSelectMessage = (messageUid) => {
        setSelectedMessageUid(messageUid);
    };

    return (
        <>
            <Tooltip
                hasArrow
                label={"Notifications"}
                placement='right'
                ml={1}
                openDelay={500}
                display={{ base: "block", md: "none" }}
            >
                <Flex
                    alignItems={"center"}
                    gap={4}
                    _hover={{ bg: "whiteAlpha.400" }}
                    borderRadius={6}
                    p={2}
                    w={{ base: 10, md: "full" }}
                    justifyContent={{ base: "center", md: "flex-start" }}
                    onClick={handleNotificationClick}
                >
                    <NotificationsLogo />
                    <Box display={{ base: "none", md: "block" }}>Notifications</Box>
                </Flex>
            </Tooltip>

            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Unread Messages</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {unreadMessages.map((message) => (
                            <div key={message.id} onClick={() => { handleViewMessage(message.senderUid); handleSelectMessage(message.id); }}>
                                <Flex alignItems="center" gap={3}>
                                    <AvatarGroup gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
                                        <Avatar src={message.avatar} alt="profile pic" />
                                    </AvatarGroup>
                                    <span>{message.text}</span>
                                </Flex>
                            </div>
                        ))}
                        {senderUserProfile && (
                            <Link to={`/message/${authUser?.username}/${senderUserProfile.username}`} as={RouterLink}>
                                View Message
                            </Link>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Notifications;
