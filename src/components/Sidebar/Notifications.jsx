
// import { useEffect, useState } from "react";
// import { query, collection, where, orderBy, getDocs, getDoc, doc, limit } from "firebase/firestore";
// import { Avatar, AvatarGroup, Box, Flex, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tooltip } from "@chakra-ui/react";
// import { NotificationsLogo } from "../../assets/constants";
// import { firestore } from "../../firebase/firebase";
// import useAuthStore from "../../store/authStore";
// import { Link as RouterLink } from "react-router-dom";

// const Notifications = () => {
//     const [showModal, setShowModal] = useState(false);
//     const [unreadMessages, setUnreadMessages] = useState([]);
//     const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
//     const [senderUserProfile, setSenderUserProfile] = useState(null);
//     const [selectedMessageUid, setSelectedMessageUid] = useState(null);
//     const authUser = useAuthStore((state) => state.user);

//     useEffect(() => {
//         if (authUser) {
//             fetchUnreadMessages();
//         }
//     }, [authUser]);

//     // const fetchUnreadMessages = async () => {
//     //     try {
//     //         const q = query(
//     //             collection(firestore, "privateMessages"),
//     //             where("users", "array-contains", authUser.uid),
//     //             where("unread", "==", true),
//     //             orderBy("createdAt", "desc")
//     //         );
    
//     //         const querySnapshot = await getDocs(q);
//     //         const unreadMessagesData = {};
//     //         querySnapshot.forEach((doc) => {
//     //             const message = { id: doc.id, ...doc.data() };
//     //             const senderUid = message.senderUid;
//     //             // Check if the sender UID is different from the authenticated user's UID
//     //             if (senderUid !== authUser.uid && !unreadMessagesData[senderUid]) {
//     //                 unreadMessagesData[senderUid] = message;
//     //             }
//     //         });
    
//     //         setUnreadMessages(Object.values(unreadMessagesData));
//     //     } catch (error) {
//     //         console.error("Error fetching unread messages:", error);
//     //     }
//     // };

//     const fetchUnreadMessages = async () => {
//         try {
//             const q = query(
//                 collection(firestore, "privateMessages"),
//                 where("users", "array-contains", authUser.uid),
//                 where("unread", "==", true),
//                 orderBy("createdAt", "desc")
//             );

//             const querySnapshot = await getDocs(q);
//             const unreadMessagesData = {};
//             querySnapshot.forEach((doc) => {
//                 const message = { id: doc.id, ...doc.data() };
//                 const senderUid = message.senderUid;

//                 // Check if the sender UID is different from the authenticated user's UID
//                 if (senderUid !== authUser.uid && !unreadMessagesData[senderUid]) {
//                     unreadMessagesData[senderUid] = message;
//                 }
//             });

//             const unreadMessagesArray = Object.values(unreadMessagesData);
//             setUnreadMessages(unreadMessagesArray);

//             // Update hasUnreadMessages based on the result
//             setHasUnreadMessages(unreadMessagesArray.length > 0);
//         } catch (error) {
//             console.error("Error fetching unread messages:", error);
//         }
//     };

//     const handleNotificationClick = () => {
//         setShowModal(true);
//         fetchUnreadMessages();
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     const handleViewMessage = async (senderUid) => {
//         try {
//             const userRef = await getDoc(doc(firestore, "users", senderUid));
//             if (userRef.exists()) {
//                 setSenderUserProfile(userRef.data());
//                 setShowModal(false);
//             }
//         } catch (error) {
//             console.error("Error", error.message);
//         }
//     };
    

//     const handleSelectMessage = (messageUid) => {
//         setSelectedMessageUid(messageUid);
//     };

//     return (
//         <>
//             <Tooltip
//                 hasArrow
//                 label={"Notifications"}
//                 placement='right'
//                 ml={1}
//                 openDelay={500}
//                 display={{ base: "block", md: "none" }}
//             >
//                 <Flex
//                     alignItems={"center"}
//                     gap={4}
//                     _hover={{ bg: "whiteAlpha.400" }}
//                     borderRadius={6}
//                     p={2}
//                     w={{ base: 10, md: "full" }}
//                     justifyContent={{ base: "center", md: "flex-start" }}
//                     onClick={handleNotificationClick}
//                 >
//                     {/* <NotificationsLogo /> */}
//                     <NotificationsLogo style={{ color: hasUnreadMessages ? "red" : "black" }} />
//                     <Box display={{ base: "none", md: "block" }}>Notifications</Box>
//                 </Flex>
//             </Tooltip>

//             <Modal isOpen={showModal} onClose={handleCloseModal}>
//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalHeader>Unread Messages</ModalHeader>
//                     <ModalCloseButton />
//                     <ModalBody>
//                         {unreadMessages.map((message) => (
//                             <div key={message.id} onClick={() => { handleViewMessage(message.senderUid); handleSelectMessage(message.id); }}>
//                                 <Flex alignItems="center" gap={3}>
//                                     <AvatarGroup gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
//                                         <Avatar src={message.avatar} alt="profile pic" />
//                                     </AvatarGroup>
//                                     <span>{message.text}</span>
//                                 </Flex>
//                             </div>
//                         ))}
//                         {senderUserProfile && (
//                             <Link to={`/message/${authUser?.username}/${senderUserProfile.username}`} as={RouterLink}>
//                                 View Message
//                             </Link>
//                         )}
//                     </ModalBody>
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// };

// export default Notifications;

// import { useEffect, useState } from "react";
// import { query, collection, where, orderBy, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
// import { Avatar, AvatarGroup, Box, Flex, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tooltip } from "@chakra-ui/react";
// import { firestore } from "../../firebase/firebase";
// import useAuthStore from "../../store/authStore";
// import { Link as RouterLink } from "react-router-dom";

// const Notifications = () => {
//     const [showModal, setShowModal] = useState(false);
//     const [unreadMessages, setUnreadMessages] = useState([]);
//     const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
//     const [senderUserProfile, setSenderUserProfile] = useState(null);
//     const authUser = useAuthStore((state) => state.user);

//     useEffect(() => {
//         if (authUser) {
//             fetchUnreadMessages();
//         }
//     }, [authUser]);

//     const fetchUnreadMessages = async () => {
//         try {
//             const q = query(
//                 collection(firestore, "privateMessages"),
//                 where("users", "array-contains", authUser.uid),
//                 where("unread", "==", true),
//                 orderBy("createdAt", "desc")
//             );

//             const querySnapshot = await getDocs(q);
//             const unreadMessagesData = {};
//             querySnapshot.forEach((doc) => {
//                 const message = { id: doc.id, ...doc.data() };
//                 const senderUid = message.senderUid;

//                 if (senderUid !== authUser.uid && !unreadMessagesData[senderUid]) {
//                     unreadMessagesData[senderUid] = message;
//                 }
//             });

//             const unreadMessagesArray = Object.values(unreadMessagesData);
//             setUnreadMessages(unreadMessagesArray);

//             // Update state
//             setHasUnreadMessages(unreadMessagesArray.length > 0);
//         } catch (error) {
//             console.error("Error fetching unread messages:", error);
//         }
//     };

//     const handleNotificationClick = () => {
//         setShowModal(true);
//     };

//     const handleCloseModal = async () => {
//         setShowModal(false);
//         // Refresh unread messages after the modal closes
//         await fetchUnreadMessages();
//     };

//     const handleViewMessage = async (senderUid, messageId) => {
//         try {
//             // Mark the message as read in Firestore
//             const messageRef = doc(firestore, "privateMessages", messageId);
//             await updateDoc(messageRef, { unread: false });

//             // Remove the message from the unread list locally
//             setUnreadMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));

//             // Update the state of hasUnreadMessages immediately
//             if (unreadMessages.length <= 1) {
//                 setHasUnreadMessages(false);
//             }

//             // Fetch the sender profile
//             const userRef = await getDoc(doc(firestore, "users", senderUid));
//             if (userRef.exists()) {
//                 setSenderUserProfile(userRef.data());
//             }
//         } catch (error) {
//             console.error("Error updating message status or fetching profile:", error);
//         }
//     };

//     return (
//         <>
//             <Tooltip
//                 hasArrow
//                 label={"Notifications"}
//                 placement="right"
//                 ml={1}
//                 openDelay={500}
//                 display={{ base: "block", md: "none" }}
//             >
//                 <Flex
//                     alignItems={"center"}
//                     gap={4}
//                     _hover={{ bg: "whiteAlpha.400" }}
//                     borderRadius={6}
//                     p={2}
//                     w={{ base: 10, md: "full" }}
//                     justifyContent={{ base: "center", md: "flex-start" }}
//                     onClick={handleNotificationClick}
//                 >
//                     {/* SVG Heart Icon with dynamic color */}
//                     <Box>
//                         <svg
//                             aria-label="Notifications"
//                             height="24"
//                             width="24"
//                             viewBox="0 0 24 24"
//                             fill={hasUnreadMessages ? "red" : "rgb(245, 245, 245)"}
//                         >
//                             <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" />
//                         </svg>
//                     </Box>
//                     <Box display={{ base: "none", md: "block" }}>Notifications</Box>
//                 </Flex>
//             </Tooltip>

//             <Modal isOpen={showModal} onClose={handleCloseModal}>
//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalHeader>Unread Messages</ModalHeader>
//                     <ModalCloseButton />
//                     <ModalBody>
//                         {unreadMessages.map((message) => (
//                             <div key={message.id} onClick={() => handleViewMessage(message.senderUid, message.id)}>
//                                 <Flex alignItems="center" gap={3}>
//                                     <AvatarGroup gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
//                                         <Avatar src={message.avatar} alt="profile pic" />
//                                     </AvatarGroup>
//                                     <span>{message.text}</span>
//                                 </Flex>
//                             </div>
//                         ))}
//                         {senderUserProfile && (
//                             <Link to={`/message/${authUser?.username}/${senderUserProfile.username}`} as={RouterLink}>
//                                 View Message
//                             </Link>
//                         )}
//                     </ModalBody>
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// };

// export default Notifications;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { query, collection, where, orderBy, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { Avatar, AvatarGroup, AvatarBadge, Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tooltip, Text } from "@chakra-ui/react";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";

const Notifications = () => {
    const [showModal, setShowModal] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const navigate = useNavigate();

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
    
            // Process each message document once
            querySnapshot.forEach((doc) => {
                const message = { id: doc.id, ...doc.data() };
                const senderUid = message.senderUid;
    
                if (senderUid !== authUser.uid) {
                    if (!unreadMessagesData[senderUid]) {
                        unreadMessagesData[senderUid] = {
                            userProfile: null,
                            unreadCount: 0,
                            latestMessage: message,  // Optionally store latest message
                        };
                    }
                    unreadMessagesData[senderUid].unreadCount += 1;
                }
            });
    
            // Fetch user profiles for each senderUid
            for (const senderUid of Object.keys(unreadMessagesData)) {
                try {
                    const userRef = await getDoc(doc(firestore, "users", senderUid));
                    if (userRef.exists()) {
                        unreadMessagesData[senderUid].userProfile = userRef.data();
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
    
            const unreadMessagesArray = Object.values(unreadMessagesData);
            setUnreadMessages(unreadMessagesArray);
            setHasUnreadMessages(unreadMessagesArray.length > 0);
        } catch (error) {
            console.error("Error fetching unread messages:", error);
        }
    };

    const handleNotificationClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = async () => {
        setShowModal(false);
        await fetchUnreadMessages();
    };

    const handleViewMessage = async (senderUid) => {
        try {
            // Close the modal before navigating
            setShowModal(false);

            // Navigate to the message page
            navigate(`/message/${authUser.username}/${senderUid}`);
        } catch (error) {
            console.error("Error navigating to message page:", error);
        }
    };

    return (
        <>
            <Tooltip
                hasArrow
                label={"Notifications"}
                placement="right"
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
                    <Box>
                        <svg
                            aria-label="Notifications"
                            height="24"
                            width="24"
                            viewBox="0 0 24 24"
                            fill={hasUnreadMessages ? "red" : "rgb(245, 245, 245)"}
                        >
                            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" />
                        </svg>
                    </Box>
                    <Box display={{ base: "none", md: "block" }}>Notifications</Box>
                </Flex>
            </Tooltip>

            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Unread Messages</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {unreadMessages.map(({ userProfile, unreadCount }) => (
                            <Flex
                                key={userProfile.uid}
                                alignItems="center"
                                gap={3}
                                cursor="pointer"
                                onClick={() => handleViewMessage(userProfile.username)}
                                _hover={{ bg: "gray.500" }}
                                p={2}
                                borderRadius="md"
                            >
                                <AvatarGroup>
                                    <Avatar src={userProfile.profilePicURL} alt="profile pic">
                                        {unreadCount > 0 && (
                                            <AvatarBadge boxSize="1.25em" bg="red.700" fontSize="0.75em" position="absolute" top="-2" right="-2">
                                                {unreadCount}
                                            </AvatarBadge>
                                        )}
                                    </Avatar>
                                </AvatarGroup>
                                <Text>
                                    {userProfile.username}
                                </Text>
                            </Flex>
                        ))}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Notifications;




