import { Avatar, AvatarGroup, Button, Flex, Link, Text, VStack } from "@chakra-ui/react";
import useFollowUser from "../../hooks/useFollowUser";
import { Link as RouterLink} from "react-router-dom";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import { useEffect } from "react";
import useAuthStore from "../../store/authStore";


const FollowerPageProfile = (follower) => {

  const authUser = useAuthStore((state) => state.user);
  const { isLoading,  followerUser, setUserProfile } = useGetUserProfileById(follower.follower.uid);
  const{ handleFollowUser, isFollowing, isUpdating } = useFollowUser(follower.follower.uid);
  

  useEffect(() => {
    setUserProfile(follower.follower);	
  
    console.log(authUser);
  }, [follower.follower, setUserProfile]);

  return (
    <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }} alignItems={"center"}>
      <Link 
        to={`/${followerUser?.username}`}
        as={RouterLink}
      >
        <AvatarGroup gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
          <Avatar src={followerUser?.profilePicURL} alt={'profile pic'}/>
        </AvatarGroup>
      </Link>
      <VStack>
        <Flex
          gap={4}
					direction={{ base: "column", sm: "row" }}
					justifyContent={{ base: "center", sm: "flex-start" }}
					alignItems={"center"}
					w={"full"}
        >
          <Link 
            to={`/${followerUser?.username}`}
            as={RouterLink}
          >
            <Text>
              {followerUser?.username}
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
					</Flex>
        </Flex>
        <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
					<Text fontSize={{ base: "xs", md: "sm" }}>
						<Text as='span' fontWeight={"bold"} mr={1}>
							{followerUser?.posts.length}
						</Text>
						Posts
					</Text>
					<Text fontSize={{ base: "xs", md: "sm" }}>
						<Text as='span' fontWeight={"bold"} mr={1}>
							{followerUser?.followers.length}
						</Text>
						  Followers
					</Text>
					<Text fontSize={{ base: "xs", md: "sm" }}>
						<Text as='span' fontWeight={"bold"} mr={1}>
							{followerUser?.following.length}
						</Text>
						Following
					</Text>
        </Flex>
      </VStack>
    </Flex>
  )
}

export default FollowerPageProfile;