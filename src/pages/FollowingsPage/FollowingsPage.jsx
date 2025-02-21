// import { Container, Flex, Link, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
// import ProfileHeader from "../../components/Profile/ProfileHeader";
// import FollowingsPageProfile from "../../components/Followings/FollowingsPageProfile";
// import { useParams } from "react-router-dom";
// import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";

// const followingsPage = () => {
//   const { username } = useParams();
//   const { isLoading, userProfile } = useGetUserProfileByUsername(username);

//   const userNotFound = !isLoading && !userProfile;
//   if (userNotFound) return <UserNotFound />;

//   return (
// 		<Container maxW='container.lg' py={5}>
// 			<Flex py={10} px={4} pl={{ base: 4, md: 10 }} w={"full"} mx={"auto"} flexDirection={"column"}>
// 				{!isLoading && userProfile && <ProfileHeader />}
// 				{isLoading && <ProfileHeaderSkeleton />}
// 			</Flex>
// 			<Flex
// 				px={{ base: 2, sm: 4 }}
// 				maxW={"full"}
// 				mx={"auto"}
// 				borderTop={"1px solid"}
// 				borderColor={"whiteAlpha.300"}
// 				direction={"column"}
// 			>
// 				<FollowingsPageProfile />

// 			</Flex>
// 		</Container>
// 	);
// }

// export default followingsPage



// // skeleton for profile header
// const ProfileHeaderSkeleton = () => {
// 	return (
// 		<Flex
// 			gap={{ base: 4, sm: 10 }}
// 			py={10}
// 			direction={{ base: "column", sm: "row" }}
// 			justifyContent={"center"}
// 			alignItems={"center"}
// 		>
// 			<SkeletonCircle size='24' />

// 			<VStack alignItems={{ base: "center", sm: "flex-start" }} gap={2} mx={"auto"} flex={1}>
// 				<Skeleton height='12px' width='150px' />
// 				<Skeleton height='12px' width='100px' />
// 			</VStack>
// 		</Flex>
// 	);
// };

// const UserNotFound = () => {
// 	return (
// 		<Flex flexDir='column' textAlign={"center"} mx={"auto"}>
// 			<Text fontSize={"2xl"}>User Not Found</Text>
// 			<Link as={RouterLink} to={"/"} color={"blue.500"} w={"max-content"} mx={"auto"}>
// 				Go home
// 			</Link>
// 		</Flex>
// 	);
// };



import { Container, Flex, Link, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import FollowingsPageProfile from "../../components/Followings/FollowingsPageProfile";
import { useParams } from "react-router-dom";
import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";
import useAuthStore from "../../store/authStore"; // Get logged-in user

const FollowingsPage = () => {
  const { username } = useParams();
  const { isLoading, userProfile } = useGetUserProfileByUsername(username);
  const authUser = useAuthStore((state) => state.user); // Get logged-in user

  const userNotFound = !isLoading && !userProfile;
  if (userNotFound) return <UserNotFound />;

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = authUser?.username === username;

  return (
    <Container maxW="container.lg" py={5}>
      <Flex py={10} px={4} pl={{ base: 4, md: 10 }} w={"full"} mx={"auto"} flexDirection={"column"}>
        {!isLoading && userProfile && <ProfileHeader />}
        {isLoading && <ProfileHeaderSkeleton />}
      </Flex>
      <Flex
        px={{ base: 2, sm: 4 }}
        maxW={"full"}
        mx={"auto"}
        borderTop={"1px solid"}
        borderColor={"whiteAlpha.300"}
        direction={"column"}
      >
        <FollowingsPageProfile isOwnProfile={isOwnProfile} />
      </Flex>
    </Container>
  );
};

export default FollowingsPage;

// Skeleton for profile header
const ProfileHeaderSkeleton = () => {
  return (
    <Flex
      gap={{ base: 4, sm: 10 }}
      py={10}
      direction={{ base: "column", sm: "row" }}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <SkeletonCircle size="24" />

      <VStack alignItems={{ base: "center", sm: "flex-start" }} gap={2} mx={"auto"} flex={1}>
        <Skeleton height="12px" width="150px" />
        <Skeleton height="12px" width="100px" />
      </VStack>
    </Flex>
  );
};

// User not found message
const UserNotFound = () => {
  return (
    <Flex flexDir="column" textAlign={"center"} mx={"auto"}>
      <Text fontSize={"2xl"}>User Not Found</Text>
      <Link as={RouterLink} to={"/"} color={"blue.500"} w={"max-content"} mx={"auto"}>
        Go home
      </Link>
    </Flex>
  );
};
