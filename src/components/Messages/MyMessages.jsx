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
// import { Avatar, AvatarBadge, AvatarGroup, Flex, Text, Link } from "@chakra-ui/react"; 
// import { firestore } from "../../firebase/firebase";
// import useAuthStore from "../../store/authStore";
// import '../../components/ChatBox/chatBox.css';
// import { useNavigate } from "react-router-dom";


// const MyMessages = () => {
//     const authUser = useAuthStore((state) => state.user);
//     const [users, setUsers] = useState([]);
//     const scroll = useRef();
   
//     const navigate = useNavigate();

//     const handleChatboxClick = (receiverUserProfile) => {

//         if (receiverUserProfile) {
//             navigate(`/message/${authUser?.username}/${receiverUserProfile.username}`);
//         }
//     }

//     useEffect(() => {
//         if (!authUser) return;
    
//         const q = query(
//             collection(firestore, "privateMessages"),
//             where("senderUid", "==", authUser.uid),
//             where( "receiverUid", "==", receiverUserProfile.uid),
//             orderBy("createdAt", "desc"),
//             limit(50)
//         );

//         const unsubscribe = onSnapshot(q, async (querySnapshot) => {
//             const fetchedUsers = {};
//             querySnapshot.forEach((doc) => {
//                 const message = { ...doc.data(), id: doc.id };
//                 if (message.receiverUid) {
//                     const receiver = message.receiverUid;
//                     if (receiver) {
//                         if (message.unread && message.uid !== authUser.uid) { 
//                             fetchedUsers[receiver].messageCount++;
//                         }
//                     }
//                 }
//             });
        
//             for (const receiver of Object.keys(fetchedUsers)) {
//                 try {
//                     const userRef = await getDoc(doc(firestore, "users", senderUid));
//                     if (userRef.exists()) {
//                         fetchedUsers[senderUid].userProfile = userRef.data();
//                     }
//                 } catch (error) {
//                     console.error("Error", error.message, "error");
//                 }
//             }
        
//             setUsers(Object.values(fetchedUsers));
//         });
    
//         return () => unsubscribe();
//     }, [authUser]);
   

//     return (
//         <main className="chat-box">
//             <div className="messages-wrapper">
//                 {users.length > 0 && (
//                     users.map(({ userProfile, messageCount }) => (
//                         <div 
//                             onClick={() => handleChatboxClick(userProfile)}
//                             key={userProfile.uid}
//                         >
//                             <Flex alignItems="center" gap={3} >
//                                 <AvatarGroup>
//                                     <Avatar src={userProfile.profilePicURL} alt={'profile pic'} >
//                                         {messageCount > 0 &&  ( 
//                                             <AvatarBadge boxSize="1.25em" bg="red.500" fontSize="0.75em" position="absolute" top="-2" right="-2">
//                                                 {messageCount}
//                                             </AvatarBadge>
//                                         )}
//                                     </Avatar>
//                                 </AvatarGroup>
//                                 <Text>{userProfile.fullName}</Text>
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
import '../../components/ChatBox/chatBox.css';
import { useNavigate } from "react-router-dom";

const MyMessages = () => {
    const authUser = useAuthStore((state) => state.user);
    const [user, setUser] = useState([]);
    const scroll = useRef();
    const navigate = useNavigate();

    const handleChatboxClick = (senderUserProfile) => {
        if (senderUserProfile) {
            navigate(`/message/${authUser?.username}/${senderUserProfile.username}`);
        }
    }

    useEffect(() => {
        if (!authUser) return;
    
        const q = query(
            collection(firestore, "privateMessages"),
            where("receiverUid", "==", authUser.uid), 
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const fetchedUsers = {};
            querySnapshot.forEach((doc) => {
                const message = { ...doc.data(), id: doc.id };
                const senderUid = message.senderUid;
                if (!fetchedUsers[senderUid]) {
                    fetchedUsers[senderUid] = {
                        userProfile: null,
                        messageCount: 0
                    };
                }
                if (message.unread) { 
                    fetchedUsers[senderUid].messageCount++;
                }
            });
        
            for (const senderUid of Object.keys(fetchedUsers)) {
                try {
                    const userRef = await getDoc(doc(firestore, "users", senderUid));
                    if (userRef.exists()) {
                        fetchedUsers[senderUid].userProfile = userRef.data();
                    }
                } catch (error) {
                    console.error("Error", error.message, "error");
                }
            }
        
            setUser(Object.values(fetchedUsers));
        });
    
        return () => unsubscribe();
    }, [authUser]);
   
    console.log(user)

    return (
        <main className="chat-box">
            <div className="messages-wrapper">
                {user.length > 0 && (
                    user.map(({ userProfile, messageCount }) => (
                        <div 
                            onClick={() => handleChatboxClick(userProfile)}
                            key={userProfile.uid}
                        >
                            <Flex alignItems="center" gap={3} >
                                <AvatarGroup>
                                    <Avatar src={userProfile.profilePicURL} alt={'profile pic'} >
                                        {messageCount > 0 &&  ( 
                                            <AvatarBadge boxSize="1.25em" bg="red.500" fontSize="0.75em" position="absolute" top="-2" right="-2">
                                                {messageCount}
                                            </AvatarBadge>
                                        )}
                                    </Avatar>
                                </AvatarGroup>
                                <Text>{userProfile.username}</Text>
                            </Flex>
                        </div>
                    ))
                )}
            </div>
            <span ref={scroll}></span>
        </main>
    );
};

export default MyMessages;
