import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";
import useUserProfileStore from "../../store/userProfileStore";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { useEffect, useState } from "react";

const Caption = ({ post }) => {
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const [createdBy, setCreatedBy] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, "users", post.createdBy));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCreatedBy(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [post.createdBy]);

  return (
    <Flex gap={4}>
      {createdBy && (
        <Link to={`/${createdBy.username}`}>
          <Avatar src={createdBy.profilePicURL} size={"sm"} />
        </Link>
      )}
      <Flex direction={"column"}>
        <Flex gap={2} alignItems={"center"}>
          {createdBy && (
            <Link to={`/${createdBy.username}`}>
              <Text fontWeight={"bold"} fontSize={12}>
                {createdBy.username}
              </Text>
            </Link>
          )}
          <Text fontSize={14}>{post.caption}</Text>
        </Flex>
        <Text fontSize={12} color={"gray"}>
          {timeAgo(post.createdAt)}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Caption;


