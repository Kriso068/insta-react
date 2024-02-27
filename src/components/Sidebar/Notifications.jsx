
// import { Box, Flex, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Link } from "@chakra-ui/react";
// import { Link as RouterLink} from "react-router-dom";
// import { NotificationsLogo } from "../../assets/constants";
// import { useState, useEffect } from "react";
// import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// import { firestore } from "../../firebase/firebase";
// import useAuthStore from "../../store/authStore";
// import useGetUserProfileById from "../../hooks/useGetUserProfileById";


// const Notifications = () => {
//     const [unreadMessages, setUnreadMessages] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [messageSenderUid, setMessageSenderUid] = useState(null); 
//     const authUser = useAuthStore((state) => state.user);

//     useEffect(() => {
//         // Fetch unread messages when the component mounts
//         fetchUnreadMessages();
//     }, []);


//     const fetchUnreadMessages = async () => {
//         try {
//             if (authUser && authUser.uid) {
//                 // Query for unread messages (where 'unread' field is true)
//                 const q = query(
//                     collection(firestore, "privateMessages"),
//                     where("users", "array-contains", authUser.uid),
//                     where("unread", "==", true),
//                     orderBy("createdAt", "desc")
//                 );
//                 const querySnapshot = await getDocs(q);
//                 const unreadMessagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setUnreadMessages(unreadMessagesData);
//             }
//         } catch (error) {
//             console.error("Error fetching unread messages:", error);
//         }
//     };

//     const handleNotificationClick = () => {
//         setShowModal(true);
//         // Fetch unread messages when the user clicks on the notification icon
//         fetchUnreadMessages();
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     const handleViewMessage = (senderUid) => {
//         setMessageSenderUid(senderUid);
    
//     };
//     console.log(messageSenderUid);

//     return (
//         <>
//             {/* Notification icon */}
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
//                     onClick={handleNotificationClick} // Handle click on the notification icon
//                 >
//                     <NotificationsLogo />
//                     <Box display={{ base: "none", md: "block" }}>Notifications</Box>
//                 </Flex>
//             </Tooltip>

//             {/* Notification modal */}
//             <Modal isOpen={showModal} onClose={handleCloseModal}>
//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalHeader>Unread Messages</ModalHeader>
//                     <ModalCloseButton />
//                     <ModalBody>
//                         {unreadMessages.map((message) => (
//                             <div key={message.id} onClick={() => handleViewMessage(message.uid)}>
//                                 {message.text}
//                             </div>
//                         ))}
//                         {/* {senderUserName && (
//                             <Link 
//                                 to={`/message/${authUser?.username}/${senderUserName}`}
//                                 as={RouterLink}
//                             >
//                                 View Message
//                             </Link>
//                         )} */}
//                     </ModalBody>
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// };

// export default Notifications;


import { Box, Flex, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Link, AvatarGroup, Avatar } from "@chakra-ui/react";
import { Link as RouterLink} from "react-router-dom";
import { NotificationsLogo } from "../../assets/constants";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, getDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";


const Notifications = () => {
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [messageSenderUid, setMessageSenderUid] = useState(null); 
    const [senderUserProfile, setUserProfile] = useState(null); 
    const authUser = useAuthStore((state) => state.user);


    useEffect(() => {
        // Fetch unread messages when the component mounts
        fetchUnreadMessages();
    }, []);

   


    // const fetchUnreadMessages = async () => {
    //     try {
    //         if (authUser && authUser.uid) {
    //             // Query for unread messages (where 'unread' field is true)
    //             const q = query(
    //                 collection(firestore, "privateMessages"),
    //                 where("users", "array-contains", authUser.uid),
    //                 where("unread", "==", true),
    //                 orderBy("createdAt", "desc")
    //             );
    //             const querySnapshot = await getDocs(q);
    //             const unreadMessagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //             setUnreadMessages(unreadMessagesData);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching unread messages:", error);
    //     }
    // };
    const fetchUnreadMessages = async () => {
        try {
            if (authUser && authUser.uid) {
                // Query for unread messages (where 'unread' field is true)
                const q = query(
                    collection(firestore, "privateMessages"),
                    where("users", "array-contains", authUser.uid),
                    where("unread", "==", true),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const unreadMessagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Filter out messages sent by the currently authenticated user
                const filteredUnreadMessages = unreadMessagesData.filter(message => message.uid !== authUser.uid);
                setUnreadMessages(filteredUnreadMessages);
            }
        } catch (error) {
            console.error("Error fetching unread messages:", error);
        }
    };
    

    const handleNotificationClick = () => {
        setShowModal(true);
        // Fetch unread messages when the user clicks on the notification icon
        fetchUnreadMessages();
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleViewMessage = (senderUid) => {
        setMessageSenderUid(senderUid);
      
    };
    useEffect(() => {
        const getUserProfile = async () => {
            setUserProfile(null);
            try {
                const userRef = await getDoc(doc(firestore, "users", messageSenderUid));
                if (userRef.exists()) {
                    setUserProfile(userRef.data());
                }
            } catch (error) {
                console.error("Error", error.message, "error");
            }
        };
    
        if (messageSenderUid) {
            getUserProfile();
        }
    }, [messageSenderUid]);

    return (
        <>
            {/* Notification icon */}
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
                    onClick={handleNotificationClick} // Handle click on the notification icon
                >
                    <NotificationsLogo />
                    <Box display={{ base: "none", md: "block" }}>Notifications</Box>
                </Flex>
            </Tooltip>

            {/* Notification modal */}
            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Unread Messages</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {unreadMessages.map((message) => (
                            <div key={message.id} onClick={() => handleViewMessage(message.uid)}>
                                <Flex alignItems={"center"} gap={3}>
                                    <AvatarGroup gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
                                        <Avatar src={message.avatar} alt={'profile pic'} />
                                    </AvatarGroup>
                                        
                                    <span>{message.text}</span>

                                </Flex>
                            </div>
                        ))}
                        {senderUserProfile && (
                            <Link 
                                to={`/message/${authUser?.username}/${senderUserProfile.username}`} // Assuming the user profile contains the username
                                as={RouterLink}
                            >
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

