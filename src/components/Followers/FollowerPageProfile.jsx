import { Avatar, AvatarGroup, Button, Flex, Link, Text, VStack } from "@chakra-ui/react";
import useFollowUser from "../../hooks/useFollowUser";
import { Link as RouterLink} from "react-router-dom";
import useAuthStore from "../../store/authStore";


const FollowerPageProfile = (follower) => {
  const authUser = useAuthStore((state) => state.user);
  const{ handleFollowUser, isFollowing, isUpdating } = useFollowUser(follower.follower.id);
  

  return (
    
    <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }} alignItems={"center"}>
      <Link 
        to={`/${follower.follower?.username}`}
        as={RouterLink}
      >
        <AvatarGroup gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
          <Avatar src={follower.follower?.profilePicURL} alt={'profile pic'}/>
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
            to={`/${follower.follower?.username}`}
            as={RouterLink}
          >
            <Text>
              {follower.follower?.username}
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
							{follower.follower?.posts.length}
						</Text>
						Posts
					</Text>
					<Text fontSize={{ base: "xs", md: "sm" }}>
						<Text as='span' fontWeight={"bold"} mr={1}>
							{follower.follower?.followers.length}
						</Text>
						  Followers
					</Text>
					<Text fontSize={{ base: "xs", md: "sm" }}>
						<Text as='span' fontWeight={"bold"} mr={1}>
							{follower.follower?.following.length}
						</Text>
						Following
					</Text>
        </Flex>
      </VStack>
    </Flex>
  )
}

export default FollowerPageProfile;