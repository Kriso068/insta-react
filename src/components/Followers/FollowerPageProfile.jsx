// import { Avatar, AvatarGroup, Button, Flex, Link, Text, VStack } from "@chakra-ui/react";
// import useFollowUser from "../../hooks/useFollowUser";
// import { Link as RouterLink} from "react-router-dom";
// import useAuthStore from "../../store/authStore";
// import useBlockAndUnblockUser from "../../hooks/useBlockAndUnblockUser";


// const FollowerPageProfile = (follower) => {
//   const authUser = useAuthStore((state) => state.user);
//   const{ handleFollowUser, isFollowing, isUpdating } = useFollowUser(follower.follower.id);
//   const{ handleBlockUser, isBlocked, isUpdatingBlock } = useBlockAndUnblockUser(follower.follower.id);
  

//   return (
    
//     <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "row", sm: "row" }} alignItems={"center"}>
//       <Link 
//         to={`/${follower.follower?.username}`}
//         as={RouterLink}
//       >
//         <AvatarGroup gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "row", sm: "row" }}>
//           <Avatar src={follower.follower?.profilePicURL} alt={'profile pic'} border="1px solid white"/>
//         </AvatarGroup>
//       </Link>
//       <VStack>
//         <Flex
//           	gap={4}
// 			direction={{ base: "row", sm: "row" }}
// 			justifyContent={{ base: "center", sm: "flex-start" }}
// 			alignItems={"center"}
// 			w={"full"}
//         >
//         	<Link 
// 				to={`/${follower.follower?.username}`}
// 				as={RouterLink}
// 			>
// 				<Text>
// 				{follower.follower?.username}
// 				</Text>
// 			</Link>
// 			<Flex gap={4} alignItems={"center"} justifyContent={"center"}>
// 				<Button
// 					bg={"blue.500"}
// 					color={"white"}
// 					_hover={{ bg: "blue.600" }}
// 					size={{ base: "xs", md: "sm" }}
// 					onClick={handleFollowUser}
// 					isLoading={isUpdating}
// 				>
// 					{isFollowing ? "Unfollow" : "Follow"}
// 				</Button>
// 				<Button
// 					bg={"red.500"}
// 					color={"white"}
// 					_hover={{ bg: "red.600" }}
// 					size={{ base: "xs", md: "sm" }}
// 					onClick={handleBlockUser}
// 					isLoading={isUpdatingBlock}
// 				>
// 					{isBlocked ? "Unblock" : "Block"}
// 				</Button>
// 			</Flex>
//         </Flex>
//         <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
// 			<Text fontSize={{ base: "xs", md: "sm" }}>
// 				<Text as='span' fontWeight={"bold"} mr={1}>
// 					{follower.follower?.posts.length}
// 				</Text>
// 				Posts
// 			</Text>
// 			<Text fontSize={{ base: "xs", md: "sm" }}>
// 				<Text as='span' fontWeight={"bold"} mr={1}>
// 					{follower.follower?.followers.length}
// 				</Text>
// 					Followers
// 			</Text>
// 			<Text fontSize={{ base: "xs", md: "sm" }}>
// 				<Text as='span' fontWeight={"bold"} mr={1}>
// 					{follower.follower?.following.length}
// 				</Text>
// 				Following
// 			</Text>
//         </Flex>
//       </VStack>
//     </Flex>
//   )
// }

// export default FollowerPageProfile;

import { Avatar, AvatarGroup, Button, Flex, Link, Text, VStack } from "@chakra-ui/react";
import useFollowUser from "../../hooks/useFollowUser";
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useBlockAndUnblockUser from "../../hooks/useBlockAndUnblockUser";

const FollowerPageProfile = ({ follower }) => { 
    const authUser = useAuthStore((state) => state.user);
    const isOwnProfile = authUser?.uid === follower?.uid;
    
    const userId = follower?.id || ""; 
    const { handleFollowUser, isFollowing, isUpdating } = useFollowUser(userId);
    const { handleBlockUser, isBlocked, isUpdatingBlock } = useBlockAndUnblockUser(userId);

    if (!follower) return <Text>Loading...</Text>;

    return (
        <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "row", sm: "row" }} alignItems={"center"}>
            <Link to={`/${follower?.username}`} as={RouterLink}>
                <AvatarGroup gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "row", sm: "row" }}>
                    <Avatar src={follower?.profilePicURL} alt="Profile pic" border="1px solid white"/>
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
                    <Link to={`/${follower?.username}`} as={RouterLink}>
                        <Text>{follower?.username}</Text>
                    </Link>
                    {!isOwnProfile && (
						<Flex gap={4} alignItems={"start"} justifyContent={"center"}>
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
					)}
                </Flex>
                <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                        <Text as='span' fontWeight={"bold"} mr={1}>
                            {follower?.posts?.length || 0}
                        </Text>
                        Posts
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                        <Text as='span' fontWeight={"bold"} mr={1}>
                            {follower?.followers?.length || 0}
                        </Text>
                        Followers
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                        <Text as='span' fontWeight={"bold"} mr={1}>
                            {follower?.following?.length || 0}
                        </Text>
                        Following
                    </Text>
                </Flex>
            </VStack>
        </Flex>
    );
};

export default FollowerPageProfile;
