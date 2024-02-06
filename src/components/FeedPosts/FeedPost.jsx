import { Box, Image } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";

const FeedPost = ({ post }) => {
	const { userProfile } = useGetUserProfileById(post.createdBy);

	return (
		<>
			<PostHeader post={post} creatorProfile={userProfile} />
			<Box my={2} borderRadius={4} overflow={"hidden"}>
				{post.imageURL && (
					<Image src={post.imageURL} alt="FEED POST IMG" />
				)}
				{post.videoURL && (
					<video preload='true' controls src={post.videoURL} width={'100%'} height={'100%'}></video>
				)}
			</Box>
			<PostFooter post={post} creatorProfile={userProfile} />
		</>
	);
};

export default FeedPost;
