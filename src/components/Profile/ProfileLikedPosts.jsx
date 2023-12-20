import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import useGetUserLikedPosts from "../../hooks/useGetUserLikedPosts";
import ProfileLikedPost from "./ProfileLikedPost";

const ProfileLikedPosts = () => {
    const { isLoading, posts } = useGetUserLikedPosts();
    const noPostsFound = !isLoading && posts.length === 0;
    if (noPostsFound) return <NoPostsFound />;

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
            {posts.map((post) => (
              <ProfileLikedPost post={post} key={post.id} />
            ))}
          </>
        )}
      </Grid>
    );
  };

  export default ProfileLikedPosts;

  const NoPostsFound = () => {
    return (
      <Flex flexDir='column' textAlign={"center"} mx={"auto"} mt={10}>
        <Text fontSize={"2xl"}>No Liked Posts Found🤔</Text>
      </Flex>
    );
};
