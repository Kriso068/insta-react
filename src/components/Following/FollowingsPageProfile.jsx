import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import FollowerPageProfile from './FollowerPageProfile';
import useGetFollwigsnByUserId from "../../hooks/useGetFollowingByUserId";

const FollowinsPageProfile = () => {

  const { isLoading, followers } = useGetFollwigsnByUserId();
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
            {followings.map((following) => (
              <FollowerPageProfile following={following} key={following.uid} />
            ))}
          </>
        )}
      </Grid>
    );
  
}

export default FollowinsPageProfile;

const NoFollowersFound = () => {
  return (
    <Flex flexDir='column' textAlign={"center"} mx={"auto"} mt={10}>
      <Text fontSize={"2xl"}>No One Is Following You Right Now🤔</Text>
    </Flex>
  );
};