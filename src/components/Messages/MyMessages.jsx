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
import { Avatar, AvatarBadge, AvatarGroup, Flex, Text, Link } from "@chakra-ui/react"; 
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";
import '../../components/ChatBox/chatBox.css';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ChatBox from "../../pages/ChatBox/Chatbox";

const MyMessages = () => {
    const authUser = useAuthStore((state) => state.user);
    const [users, setUsers] = useState([]);
    const scroll = useRef();
    const [senderUserProfile, setUserProfile] = useState(null); 
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
            where("users", "array-contains", authUser.uid),
            orderBy("createdAt", "desc"),
            limit(50)
        );
    
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const fetchedUsers = {};
            querySnapshot.forEach((doc) => {
                const message = { ...doc.data(), id: doc.id };
                console.log(message.users);
                if (message.users) {
                    const senderUid = message.users.find(uid => uid !== authUser.uid);
                    if (senderUid) {
                        fetchedUsers[senderUid] = (fetchedUsers[senderUid]);
                    }
                }
            });
    
            for (const senderUid of Object.keys(fetchedUsers)) {
                try {
                    const userRef = await getDoc(doc(firestore, "users", senderUid));
                    if (userRef.exists()) {
                        setUserProfile(userRef.data());
                        
                    }
                } catch (error) {
                    console.error("Error", error.message, "error");
                }
            }
    
            setUsers(Object.entries(fetchedUsers));
        });
    
        return () => unsubscribe();
    }, [authUser]);
   

    console.log(users);

    return (
        <main className="chat-box">
            <div className="messages-wrapper">
                {users.length > 0 && (
                    users.map(([uid, messageCount]) => (
                        <div 
                            onClick={() => handleChatboxClick(senderUserProfile)}
                            key={uid}
                        >
                            <Flex alignItems="center" gap={3} >
                                <AvatarGroup>
                                    <Avatar src={senderUserProfile.profilePicURL} alt={'profile pic'} >
                                        <AvatarBadge boxSize="1.25em" bg="red.500" fontSize="0.75em" position="absolute" top="-2" right="-2">
                                            {messageCount}
                                        </AvatarBadge>
                                    </Avatar>
                                </AvatarGroup>
                                <Text>{senderUserProfile.fullName}</Text>
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


