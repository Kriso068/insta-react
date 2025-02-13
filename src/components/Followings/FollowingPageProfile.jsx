import { Avatar, AvatarGroup, Button, Flex, Link, Text, VStack } from "@chakra-ui/react";
import useFollowUser from "../../hooks/useFollowUser";
import { Link as RouterLink} from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useBlockAndUnblockUser from "../../hooks/useBlockAndUnblockUser";

const FollowinPageProfile = (following) => {

  const authUser = useAuthStore((state) => state.user);
  const{ handleFollowUser, isFollowing, isUpdating } = useFollowUser(following.following.uid);
  const{ handleBlockUser, isBlocked, isUpdatingBlock } = useBlockAndUnblockUser(following.following.uid);

  return (
    <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "row", sm: "row" }} alignItems={"center"}>
      <Link 
        to={`/${following.following?.username}`}
        as={RouterLink}
      >
        <AvatarGroup gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "row", sm: "row" }}>
          <Avatar src={following.following?.profilePicURL} alt={'profile pic'} border="1px solid white"/>
        </AvatarGroup>
      </Link>
      <VStack>
        <Flex
          gap={4}
					direction={{ base: "row", sm: "row" }}
					justifyContent={{ base: "center", sm: "flex-start" }}
					alignItems={"center"}
					w={"full"}
        >
          <Link 
            to={`/${following.following?.username}`}
            as={RouterLink}
          >
            <Text>
              {following.following?.username}
            </Text>
          </Link>
          <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
                <Button
                    bg={"blue.500"}
                    color={"white"}
                    _hover={{ bg: "blue.600" }}
                    size={{ base: "xs", md: "sm" }}
                    onClick={handleFollowUser}
                    isLoading={isUpdating}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <Button
                  bg={"red.500"}
                  color={"white"}
                  _hover={{ bg: "red.600" }}
                  size={{ base: "xs", md: "sm" }}
                  onClick={handleBlockUser}
                  isLoading={isUpdatingBlock}
                >
                  {isBlocked ? "Unblock" : "Block"}
                </Button>
            </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
            <Text fontSize={{ base: "xs", md: "sm" }}>
                <Text as='span' fontWeight={"bold"} mr={1}>
                    {following.following?.posts.length}
                </Text>
                Posts
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }}>
                <Text as='span' fontWeight={"bold"} mr={1}>
                    {following.following?.followers.length}
                </Text>
                    Followers
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }}>
                <Text as='span' fontWeight={"bold"} mr={1}>
                    {following.following?.following.length}
                </Text>
                Following
            </Text>
        </Flex>
      </VStack>
    </Flex>
  )
}

export default FollowinPageProfile;