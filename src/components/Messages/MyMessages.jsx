// import { useEffect, useRef, useState } from "react";
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
// import { Avatar, AvatarBadge, AvatarGroup, Flex, Text } from "@chakra-ui/react"; 
// import { firestore } from "../../firebase/firebase";
// import useAuthStore from "../../store/authStore";
// import '../../components/ChatBox/chatBox.css';
// import { useNavigate } from "react-router-dom";

// const MyMessages = () => {
//     const authUser = useAuthStore((state) => state.user);
//     const [user, setUser] = useState([]);
//     const scroll = useRef();
//     const navigate = useNavigate();

//     const handleChatboxClick = (senderUserProfile) => {
//         if (senderUserProfile) {
//             navigate(`/message/${authUser?.username}/${senderUserProfile.username}`);
//         }
//     }

//     useEffect(() => {
//         if (!authUser) return;
    
//         const q = query(
//             collection(firestore, "privateMessages"),
//             where("receiverUid", "==", authUser.uid), 
//             orderBy("createdAt", "desc"),
//             limit(50)
//         );

//         const unsubscribe = onSnapshot(q, async (querySnapshot) => {
//             const fetchedUsers = {};
//             querySnapshot.forEach((doc) => {
//                 const message = { ...doc.data(), id: doc.id };
//                 const senderUid = message.senderUid;
//                 if (!fetchedUsers[senderUid]) {
//                     fetchedUsers[senderUid] = {
//                         userProfile: null,
//                         messageCount: 0
//                     };
//                 }
//                 if (message.unread) { 
//                     fetchedUsers[senderUid].messageCount++;
//                 }
//             });
        
//             for (const senderUid of Object.keys(fetchedUsers)) {
//                 try {
//                     const userRef = await getDoc(doc(firestore, "users", senderUid));
//                     if (userRef.exists()) {
//                         fetchedUsers[senderUid].userProfile = userRef.data();
//                     }
//                 } catch (error) {
//                     console.error("Error", error.message, "error");
//                 }
//             }
        
//             setUser(Object.values(fetchedUsers));
//         });
    
//         return () => unsubscribe();
//     }, [authUser]);
   

//     return (
//         <main className="chat-box">
//             <div className="messages-wrapper">
//                 {user.length > 0 && (
//                     user.map(({ userProfile, messageCount }) => (
//                         <div 
//                             onClick={() => handleChatboxClick(userProfile)}
//                             key={userProfile.uid}
//                         >
//                             <Flex alignItems="center" 
//                                 gap={3} 
//                                 cursor="pointer" 
//                                 _hover={{ bg: "gray.700" }}
//                                 p={2}
//                                 borderRadius="md">
//                                 <AvatarGroup>
//                                     <Avatar src={userProfile.profilePicURL} alt={'profile pic'} >
//                                         {messageCount > 0 &&  ( 
//                                             <AvatarBadge boxSize="1.25em" bg="red.500" fontSize="0.75em" position="absolute" top="-2" right="-2">
//                                                 {messageCount}
//                                             </AvatarBadge>
//                                         )}
//                                     </Avatar>
//                                 </AvatarGroup>
//                                 <Text>
//                                 {userProfile.username}</Text>
//                             </Flex>
//                         </div>
//                     ))
//                 )}
//             </div>
//             <span ref={scroll}></span>
//         </main>
//     );
// };

// export default MyMessages;
import { useEffect, useRef, useState } from "react";
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    where,
    getDoc,
    doc
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

    const handleChatboxClick = (senderUserProfile) => {
        if (senderUserProfile) {
            navigate(`/message/${authUser?.username}/${senderUserProfile.username}`);
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
                                    <Text fontSize="sm" color="gray.400">
                                        {latestMessage}
                                    </Text>
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
