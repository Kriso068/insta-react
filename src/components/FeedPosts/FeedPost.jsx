import { Box, Image } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import useAuthStore from "../../store/authStore";

const FeedPost = ({ post }) => {
	const { userProfile } = useGetUserProfileById(post.createdBy);

	const authUser = useAuthStore((state) => state.user);
	const blockedUsers = userProfile ? userProfile.blockedUsers : [];

    const banned = blockedUsers.includes(authUser?.uid)


	return (
		<>
			{!banned && (
			<div>
				<PostHeader post={post} creatorProfile={userProfile} />
				<Box my={2} borderRadius={4} overflow={"hidden"}>
					{post.imageURL && (
						<Image src={post.imageURL} alt="FEED POST IMG" />
					)}
					{post.videoURL && (
						<video preload='true' controls src={post.videoURL} width={'100%'} height={'100%'}></video>
					)}
					{post.videoRecordedURL && (
						<video autoPlay controls src={post.videoURL} alt='profile post' w={"100%"} h={"100%"} objectfit={"cover"}></video>
					)}
				</Box>
				<PostFooter post={post} creatorProfile={userProfile} />
			</div>
			)}
			</>
	);
};

export default FeedPost;
