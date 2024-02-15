// import { Box, Flex, Tooltip } from "@chakra-ui/react";
// import { NotificationsLogo } from "../../assets/constants";

// const Notifications = () => {
// 	return (
// 		<Tooltip
// 			hasArrow
// 			label={"Notifications"}
// 			placement='right'
// 			ml={1}
// 			openDelay={500}
// 			display={{ base: "block", md: "none" }}
// 		>
// 			<Flex
// 				alignItems={"center"}
// 				gap={4}
// 				_hover={{ bg: "whiteAlpha.400" }}
// 				borderRadius={6}
// 				p={2}
// 				w={{ base: 10, md: "full" }}
// 				justifyContent={{ base: "center", md: "flex-start" }}
// 			>
// 				<NotificationsLogo />
// 				<Box display={{ base: "none", md: "block" }}>Notifications</Box>
// 			</Flex>
// 		</Tooltip>
// 	);
// };

// export default Notifications;

import { Box, Flex, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { NotificationsLogo } from "../../assets/constants";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";

const Notifications = () => {
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);
	const authUser = useAuthStore((state) => state.user);

    useEffect(() => {
        // Fetch unread messages when the component mounts
        fetchUnreadMessages();
    }, []);

    const fetchUnreadMessages = async () => {
        try {
            // Query for unread messages (where 'unread' field is true)
            const q = query(
                collection(firestore, "privateMessages"),
                where("users", "array-contains", authUser?.uid),
                where("unread", "==", true),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const unreadMessagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setUnreadMessages(unreadMessagesData);
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
                    onClick={handleNotificationClick} // Handle click on the notification icon
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
                        {/* Display unread messages here */}
                        {unreadMessages.map((message) => (
                            <div key={message.id}>{message.text}</div>
                        ))}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Notifications;
