import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import useGetFollwersByUserId from "../../hooks/useGetFollwersByUserId";
import FollowerPageProfile from "./FollowerPageProfile";
import useAuthStore from "../../store/authStore";


const FolowersPageProfile = () => {

  const { isLoading, followers } = useGetFollwersByUserId();
  const authUser = useAuthStore((state) => state.user);
  const noFollowersFound = !isLoading && followers.length === 0;
  if (noFollowersFound) return <NoFollowersFound />; 


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
                <Box h='300px'>contents wrapped</Box>
              </Skeleton>
            </VStack>
          ))}

        {!isLoading && (
          <>
            {followers.map((follower) => (
              <FollowerPageProfile key={follower.uid} follower={follower} />
            ))}
          </>
        )}
      </Grid>
    );
  
}

export default FolowersPageProfile;

const NoFollowersFound = () => {
  return (
    <Flex flexDir='column' textAlign={"center"} mx={"auto"} mt={10}>
      <Text fontSize={"2xl"}>No One Is Following You Right Now🤔</Text>
    </Flex>
  );
};