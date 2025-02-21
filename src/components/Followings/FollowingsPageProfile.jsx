// import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
// import FollowingPageProfile from './FollowingPageProfile';
// import useGetFollwingsByUserId from "../../hooks/useGetFollowingsByUserId";

// const FollowingsPageProfile = () => {

//   const { isLoading, followings } = useGetFollwingsByUserId();
//   const noFollowingsFound = !isLoading && followings.length === 0;
//   if (noFollowingsFound) return <NoFollowingsFound />; 


//   return (
//     <Grid
//         templateColumns={{
//           sm: "repeat(1, 1fr)",
//           md: "repeat(3, 1fr)",
//         }}
//         gap={1}
//         columnGap={1}
//       >
//         {isLoading &&
//           [0, 1, 2].map((_, idx) => (
//             <VStack key={idx} alignItems={"flex-start"} gap={4}>
//               <Skeleton w={"full"}>
//                 <Box h='300px'>contents wrapped</Box>
//               </Skeleton>
//             </VStack>
//           ))}

//         {!isLoading && (
//           <>
//             {followings.map((following) => (
//               <FollowingPageProfile following={following} key={following.uid} />
//             ))}
//           </>
//         )}
//       </Grid>
//     );
  
// }

// export default FollowingsPageProfile;

// const NoFollowingsFound = () => {
//   return (
//     <Flex flexDir='column' textAlign={"center"} mx={"auto"} mt={10}>
//       <Text fontSize={"2xl"}>You Following No One Right Now🤔</Text>
//     </Flex>
//   );
// };

import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import FollowingPageProfile from "./FollowingPageProfile";
import useGetFollowingsByUserId from "../../hooks/useGetFollowingsByUserId";
import useAuthStore from "../../store/authStore"; // Get logged-in user

const FollowingsPageProfile = () => {
  const { isLoading, followings } = useGetFollowingsByUserId();
  const authUser = useAuthStore((state) => state.user); // Get logged-in user

  // Check if we're viewing our own profile
  const isOwnProfile = followings.some((following) => following.uid === authUser?.uid);

  // Dynamic empty message based on profile
  const NoFollowingsMessage = isOwnProfile
    ? "You are following no one right now 🤔"
    : "This user is not following anyone right now 🤔";

  // Show empty state message if no followings found
  if (!isLoading && followings.length === 0) return <NoFollowingsFound message={NoFollowingsMessage} />;

  return (
    <Grid
      templateColumns={{
        sm: "repeat(1, 1fr)",
        md: "repeat(3, 1fr)",
      }}
      gap={1}
      columnGap={1}
    >
      {isLoading &&
        [0, 1, 2].map((_, idx) => (
          <VStack key={idx} alignItems={"flex-start"} gap={4}>
            <Skeleton w={"full"}>
              <Box h="300px">contents wrapped</Box>
            </Skeleton>
          </VStack>
        ))}

      {!isLoading && (
        <>
          {followings
            .filter((following) => following.uid !== authUser?.uid) // Hide your own profile
            .map((following) => (
              <FollowingPageProfile following={following} key={following.uid} />
            ))}
        </>
      )}
    </Grid>
  );
};

export default FollowingsPageProfile;

// Dynamic message component for no followings
const NoFollowingsFound = ({ message }) => {
  return (
    <Flex flexDir="column" textAlign={"center"} mx={"auto"} mt={10}>
      <Text fontSize={"2xl"}>{message}</Text>
    </Flex>
  );
};
