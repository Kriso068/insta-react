import {
	Avatar, 
	Divider, 
	Flex, 
	GridItem, 
	Image, 
	Modal, 
	ModalBody, 
	ModalCloseButton, 
	ModalContent, 
	ModalOverlay, 
	Skeleton, 
	SkeletonCircle, 
	Text, 
	VStack, 
	useDisclosure,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import Comment from "../Comment/Comment";
import PostFooter from "../FeedPosts/PostFooter";
import Caption from "../Comment/Caption";
import { useEffect, useState} from "react";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import { Link } from "react-router-dom";


const ProfileLikedPost = ({ post }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isLoading, userProfile: createdByUser, setUserProfile } = useGetUserProfileById(post.createdBy);
	const [isLikedPage, setisLikedPage] = useState(true);

	
	useEffect(() => {
	  	setUserProfile(post.createdBy);	
		
	}, [post.createdBy, setUserProfile]);

	const handleRefresh = () =>{

		isLikedPage ? window.location.reload() : '';
	}


	return (
		<>
			<GridItem
				cursor={"pointer"}
				borderRadius={4}
				overflow={"hidden"}
				border={"1px solid"}
				borderColor={"whiteAlpha.300"}
				position={"relative"}
				aspectRatio={1 / 1}
				onClick={onOpen}
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
								{post.likes.length}
							</Text>
						</Flex>

						<Flex>
							<FaComment size={20} />
							<Text fontWeight={"bold"} ml={2}>
								{post.comments.length}
							</Text>
						</Flex>
					</Flex>
				</Flex>

				{post.imageURL && (
					<Image src={post.imageURL} alt="FEED POST IMG" w={"100%"} h={"100%"} objectfit={"cover"}/>
				)}
				{post.videoURL && (
					<video preload='true' controls src={post.videoURL} w={"100%"} h={"100%"} objectfit={"cover"}></video>
				)}
				{post.videoRecordedURL && (
					<video autoPlay controls src={post.videoURL} alt='profile post' w={"100%"} h={"100%"} objectfit={"cover"}></video>
				)}
			</GridItem>

			<Modal isOpen={isOpen} onClose={() => { onClose(); handleRefresh(); }} isCentered={true} size={{ base: "3xl", md: "5xl" }}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody bg={"black"} pb={5}>
						<Flex
							gap='4'
							w={{ base: "90%", sm: "70%", md: "full" }}
							mx={"auto"}
							maxH={"90vh"}
							minH={"50vh"}
						>
							<Flex
								borderRadius={4}
								overflow={"hidden"}
								border={"1px solid"}
								borderColor={"whiteAlpha.300"}
								flex={1.5}
								justifyContent={"center"}
								alignItems={"center"}
							>
								{post.imageURL && (
									<Image src={post.imageURL} alt="FEED POST IMG" />
								)}
								{post.videoURL && (
									<video preload='true' controls src={post.videoURL} width={'100%'} height={'100%'}></video>
								)}
								{post.videoRecordedURL && (
									<video autoPlay controls src={post.videoURL} alt='profile post' w={"100%"} h={"100%"} objectfit={"cover"}></video>
								)}
							</Flex>
							<Flex flex={1} flexDir={"column"} px={10} display={{ base: "none", md: "flex" }}>
								<Flex alignItems={"center"} justifyContent={"space-between"}>
									<Flex alignItems={"center"} gap={4}>
										{createdByUser ? (
											<>
											<Link to={`/${createdByUser.username}`}>
												<Avatar src={createdByUser?.profilePicURL} size={"sm"} name={createdByUser?.username} />
											</Link>
											<Link to={`/${createdByUser.username}`}>
												<Text fontWeight={"bold"} fontSize={12}>
													{createdByUser?.username}
												</Text>
											</Link>
											</>
											) : (
												<ProfileHeaderSkeleton />
											)}
									</Flex>
								</Flex>
								<Divider my={4} bg={"gray.500"} />
								<VStack w='full' alignItems={"start"} maxH={"350px"} overflowY={"auto"}>
									{/* CAPTION */}
									{post.caption && <Caption post={post} />}
									{/* COMMENTS */}
									{post.comments.map((comment, id) => (
										<Comment key={id} comment={comment} />
									))}
								</VStack>
								<Divider my={4} bg={"gray.8000"} />

								<PostFooter isLikedPage={true} post={post} />
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileLikedPost;

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
