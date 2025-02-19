
import { Box, Image } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import useAuthStore from "../../store/authStore";

const FeedPost = ({ post }) => {
	const { userProfile } = useGetUserProfileById(post.createdBy);
	const authUser = useAuthStore((state) => state.user);

	const blockedUsersByOwner = userProfile?.blockedUsers || [];

	const isBlocked = blockedUsersByOwner.includes(authUser?.uid);

	if (isBlocked) return null;

	return (
		<Box>
			<PostHeader post={post} creatorProfile={userProfile} />
			<Box my={2} borderRadius={4} overflow={"hidden"}>
				{post.imageURL && (
					<Image src={post.imageURL} alt="FEED POST IMG" w={"100%"} h={"auto"} objectfit={"cover"} />
				)}
				{post.videoURL && (
					<video preload='true' controls src={post.videoURL} width={'100%'} height={'auto'} style={{ objectFit: "cover" }}></video>
				)}
				{post.videoRecordedURL && (
					<video preload='true' controls src={post.videoRecordedURL} alt='profile post' w={"100%"} h={"auto"} style={{ objectFit: "cover" }}></video>
				)}
			</Box>
			<PostFooter post={post} creatorProfile={userProfile} />
		</Box>
	);
};

export default FeedPost;

