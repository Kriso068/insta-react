import { Box, Flex, Text, Link, GridItem, Container, SkeletonCircle, VStack, Skeleton} from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3Gap, BsSuitHeart } from "react-icons/bs";
import { Link as RouterLink, useParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import useUserProfileStore from "../../store/userProfileStore";
import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";
import ProfileTabs from "../Profile/ProfileTabs";
import ProfilePosts from "../Profile/ProfilePosts";
import ProfileHeader from "../Profile/ProfileHeader";


const SavedPosts = ({ post }) => {
    const { username } = useParams();
	const { isLoading, userProfile } = useGetUserProfileByUsername(username);
    const authUser = useAuthStore((state) => state.user);
    console.log(userProfile)

	const userNotFound = !isLoading && !userProfile;
	if (userNotFound) return <UserNotFound />;


    return (
        <>
        	<Container maxW='container.lg' py={5}>
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
                    <ProfileTabs />
                    {/* <ProfilePosts /> */}
                </Flex>
            </Container>
	
        <GridItem
            cursor={"pointer"}
            borderRadius={4}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"whiteAlpha.300"}
            position={"relative"}
            aspectRatio={1 / 1}
        >
            <Flex
                opacity={0}
                _hover={{ opacity: 1 }}
                position={"absolute"}
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg={"blackAlpha.700"}
                transition={"all 0.3s ease"}
                zIndex={1}
                justifyContent={"center"}
            >
                <Flex alignItems={"center"} justifyContent={"center"} gap={50}>
                    <Flex>
                        <AiFillHeart size={20} />
                        <Text fontWeight={"bold"} ml={2}>
                            {/* {userProfile.post.likes.length} */}
                        </Text>
                    </Flex>

                    <Flex>
                        <FaComment size={20} />
                        <Text fontWeight={"bold"} ml={2}>
                            {/* {post.comments.length} */}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            {/* <Image src={post.imageURL} alt='profile post' w={"100%"} h={"100%"} objectFit={"cover"} /> */}
        </GridItem>

      </>
    )
}

export default SavedPosts

// skeleton for profile header
const ProfileHeaderSkeleton = () => {
	return (
		<Flex
			gap={{ base: 4, sm: 10 }}
			py={10}
			direction={{ base: "column", sm: "row" }}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<SkeletonCircle size='24' />

			<VStack alignItems={{ base: "center", sm: "flex-start" }} gap={2} mx={"auto"} flex={1}>
				<Skeleton height='12px' width='150px' />
				<Skeleton height='12px' width='100px' />
			</VStack>
		</Flex>
	);
};


const UserNotFound = () => {
	return (
		<Flex flexDir='column' textAlign={"center"} mx={"auto"}>
			<Text fontSize={"2xl"}>User Not Found</Text>
			<Link as={RouterLink} to={"/"} color={"blue.500"} w={"max-content"} mx={"auto"}>
				Go home
			</Link>
		</Flex>
	);
};