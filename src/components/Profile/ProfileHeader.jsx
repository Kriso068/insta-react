// import { Avatar, Button, Flex, Text, Link, VStack, useDisclosure, Box } from "@chakra-ui/react";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import useUserProfileStore from "../../store/userProfileStore";
// import useAuthStore from "../../store/authStore";
// import EditProfile from "./EditProfile";
// import useFollowUser from "../../hooks/useFollowUser";
// import useBlockAndUnblockUser from "../../hooks/useBlockAndUnblockUser";
// import { BsFillSendFill } from "react-icons/bs";

// const ProfileHeader = () => {
// 	const { userProfile } = useUserProfileStore();
// 	const authUser = useAuthStore((state) => state.user);
// 	const { isOpen, onOpen, onClose } = useDisclosure();
// 	const { handleFollowUser, isFollowing, isUpdating } = useFollowUser(userProfile?.uid);
// 	const { handleBlockUser, isBlocked, isUpdatingBlock } = useBlockAndUnblockUser(userProfile?.uid);
// 	const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
// 	const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;

// 	const blockedUsers = userProfile ? userProfile.blockedUsers : [];
// 	const banned = blockedUsers.includes(authUser?.uid);

// 	const navigate = useNavigate();

// 	const handleSendMessage = () => {
// 		if (userProfile) {
// 			navigate(`/${authUser?.username}/messages`);
// 		}
// 	};

// 	return (
// 		<VStack align="end" w="full">
// 			{/* Username at the top */}
// 			<Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
// 				{userProfile.username}
// 			</Text>

// 			{/* Profile Pic + Stats in One Row */}
// 			<Flex 
// 				w="full" 
// 				alignItems="center" 
// 				justifyContent="space-between" 
// 				direction="row"
// 			>
// 				{/* Profile Picture */}
// 				<Link to={`/${userProfile?.username}`} as={RouterLink}>
// 					<Avatar 
// 						src={userProfile.profilePicURL} 
// 						alt="Profile pic" 
// 						size={{ base: "lg", md: "xl" }} 
// 						border="1px solid white"
// 					/>
// 				</Link>

// 				{/* Stats (Clickable Posts, Followers, Following) */}
// 				<Flex flex={1} justify="end" gap="4" align="center" ml={{ base: 4, md: 10 }}>
// 					<Link as={RouterLink} to={`/${userProfile?.username}`} _hover={{ textDecoration: "none" }}>
// 						<Text fontSize={{ base: "sm", md: "md" }}>
// 							<Text as="span" fontWeight="bold">{userProfile.posts.length}</Text> Posts
// 						</Text>
// 					</Link>
// 					<Link as={RouterLink} to={`/${userProfile?.username}/followers`} _hover={{ textDecoration: "none" }}>
// 						<Text fontSize={{ base: "sm", md: "md" }}>
// 							<Text as="span" fontWeight="bold">{userProfile.followers.length}</Text> Followers
// 						</Text>
// 					</Link>
// 					<Link as={RouterLink} to={`/${userProfile?.username}/followings`} _hover={{ textDecoration: "none" }}>
// 						<Text fontSize={{ base: "sm", md: "md" }}>
// 							<Text as="span" fontWeight="bold">{userProfile.following.length}</Text> Following
// 						</Text>
// 					</Link>
// 				</Flex>
// 			</Flex>

// 			{/* Bio & Edit Profile in the Same Row */}
// 			<Flex w="full" alignItems="center" justify="space-between" mt={2}>
// 				{/* Bio Section */}
// 				<Box ps={{base: 4}}>
// 					<Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">{userProfile.fullName}</Text>
// 					<Text fontSize={{ base: "sm", md: "md" }}>{userProfile.bio}</Text>
// 				</Box>

// 				{/* Edit Profile Button (Only for Own Profile) */}
// 				{visitingOwnProfileAndAuth && (
// 					<Box  display="flex" gap={{base: 5, md: 5}}>

// 						<Button
// 							bg={"white"}
// 							color={"black"}
// 							_hover={{ bg: "whiteAlpha.800" }}
// 							size={{ base: "xs", md: "sm" }}
// 							onClick={onOpen}
// 						>
// 							Edit Profile
// 						</Button>
// 						<Button
// 							bg={"white"}
// 							color={"black"}
// 							_hover={{ bg: "whiteAlpha.800" }}
// 							size={{ base: "xs", md: "sm" }}
// 							onClick={handleSendMessage}
// 							flex="1"
// 						>
// 							<BsFillSendFill />
// 						</Button>
// 					</Box>
// 				)}
// 			</Flex>

// 			{/* Follow, Block, Message Buttons in One Row */}
// 			{visitingAnotherProfileAndAuth && !banned && (
// 				<Flex w="full" justify={{ base: "space-between", md: "flex-start" }} gap={4} mt={3}>
// 					<Button
// 						bg="blue.500"
// 						color="white"
// 						_hover={{ bg: "blue.600" }}
// 						size={{ base: "xs", md: "sm" }}
// 						onClick={handleFollowUser}
// 						isLoading={isUpdating}
// 						flex="1"
// 					>
// 						{isFollowing ? "Unfollow" : "Follow"}
// 					</Button>
// 					<Button
// 						bg="red.500"
// 						color="white"
// 						_hover={{ bg: "red.600" }}
// 						size={{ base: "xs", md: "sm" }}
// 						onClick={handleBlockUser}
// 						isLoading={isUpdatingBlock}
// 						flex="1"
// 					>
// 						{isBlocked ? "Unblock" : "Block"}
// 					</Button>
// 					<Button
// 						bg={"white"}
// 						color={"black"}
// 						_hover={{ bg: "whiteAlpha.800" }}
// 						size={{ base: "xs", md: "sm" }}
// 						onClick={handleSendMessage}
// 						flex="1"
// 					>
// 						<BsFillSendFill />
// 					</Button>
// 				</Flex>
// 			)}

// 			{isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
// 		</VStack>
// 	);
// };

// export default ProfileHeader;
import { Avatar, Button, Flex, Text, Link, VStack, useDisclosure, Box, useBreakpointValue } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";
import useBlockAndUnblockUser from "../../hooks/useBlockAndUnblockUser";
import { BsFillSendFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi"; 
import useLogout from "../../hooks/useLogout";
import { useState } from "react";

const ProfileHeader = () => {
	const { userProfile } = useUserProfileStore();
	const authUser = useAuthStore((state) => state.user);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { handleFollowUser, isFollowing, isUpdating } = useFollowUser(userProfile?.uid);
	const { handleBlockUser, isBlocked, isUpdatingBlock } = useBlockAndUnblockUser(userProfile?.uid);
	const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
	const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;

	const blockedUsers = userProfile ? userProfile.blockedUsers : [];
	const banned = blockedUsers.includes(authUser?.uid);
	const navigate = useNavigate();
	
	const { handleLogout, isLoggingOut } = useLogout();

	const isMobile = useBreakpointValue({ base: true, md: false }); // Detect if mobile

	const handleSendMessage = () => {
		if (userProfile) {
			navigate(`/${authUser?.username}/messages`);
		}
	};


	return (
		<VStack align="end" w="full">
			{/* Username & Logout Button in the Same Row on Mobile */}
			<Flex w="full" alignItems="center" justify="end" gap="7">
				<Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
					{userProfile.username}
				</Text>

				{/* Logout Button (Only on Mobile, Only for Own Profile) */}
				{isMobile && visitingOwnProfileAndAuth && (
					<Flex cursor="pointer" onClick={handleLogout}>
						<Button
							variant={"ghost"}
							_hover={{ bg: "transparent" }}
							isLoading={isLoggingOut}
							fontSize="sm"
							p={0}
							m={0}
						>
							<BiLogOut size={25}/>
						</Button>
					</Flex>
				)}
			</Flex>

			{/* Profile Pic + Stats in One Row */}
			<Flex 
				w="full" 
				alignItems="center" 
				justifyContent="space-between" 
				direction="row"
			>
				{/* Profile Picture */}
				<Link to={`/${userProfile?.username}`} as={RouterLink}>
					<Avatar 
						src={userProfile.profilePicURL} 
						alt="Profile pic" 
						size={{ base: "lg", md: "xl" }} 
						border="1px solid white"
					/>
				</Link>

				{/* Stats (Clickable Posts, Followers, Following) */}
				<Flex flex={1} justify="end" gap="4" align="center" ml={{ base: 4, md: 10 }}>
					<Link as={RouterLink} to={`/${userProfile?.username}`} _hover={{ textDecoration: "none" }}>
						<Text fontSize={{ base: "sm", md: "md" }}>
							<Text as="span" fontWeight="bold">{userProfile.posts.length}</Text> Posts
						</Text>
					</Link>
					<Link as={RouterLink} to={`/${userProfile?.username}/followers`} _hover={{ textDecoration: "none" }}>
						<Text fontSize={{ base: "sm", md: "md" }}>
							<Text as="span" fontWeight="bold">{userProfile.followers.length}</Text> Followers
						</Text>
					</Link>
					<Link as={RouterLink} to={`/${userProfile?.username}/followings`} _hover={{ textDecoration: "none" }}>
						<Text fontSize={{ base: "sm", md: "md" }}>
							<Text as="span" fontWeight="bold">{userProfile.following.length}</Text> Following
						</Text>
					</Link>
				</Flex>
			</Flex>

			{/* Bio & Edit Profile in the Same Row */}
			<Flex w="full" alignItems="center" justify="space-between" mt={2}>
				{/* Bio Section */}
				<Box ps={{ base: 4 }}>
					<Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">{userProfile.fullName}</Text>
					<Text fontSize={{ base: "sm", md: "md" }}>{userProfile.bio}</Text>
				</Box>

				{/* Edit Profile Button (Only for Own Profile) */}
				{visitingOwnProfileAndAuth && (
					<Box display="flex" gap={{ base: 5, md: 5 }}>
						<Button
							bg={"white"}
							color={"black"}
							_hover={{ bg: "whiteAlpha.800" }}
							size={{ base: "xs", md: "sm" }}
							onClick={onOpen}
						>
							Edit Profile
						</Button>
						<Button
							bg={"white"}
							color={"black"}
							_hover={{ bg: "whiteAlpha.800" }}
							size={{ base: "xs", md: "sm" }}
							onClick={handleSendMessage}
							flex="1"
						>
							<BsFillSendFill />
						</Button>
					</Box>
				)}
			</Flex>

			{/* Follow, Block, Message Buttons in One Row */}
			{visitingAnotherProfileAndAuth && !banned && (
				<Flex w="full" justify={{ base: "space-between", md: "flex-start" }} gap={4} mt={3}>
					<Button
						bg="blue.500"
						color="white"
						_hover={{ bg: "blue.600" }}
						size={{ base: "xs", md: "sm" }}
						onClick={handleFollowUser}
						isLoading={isUpdating}
						flex="1"
					>
						{isFollowing ? "Unfollow" : "Follow"}
					</Button>
					<Button
						bg="red.500"
						color="white"
						_hover={{ bg: "red.600" }}
						size={{ base: "xs", md: "sm" }}
						onClick={handleBlockUser}
						isLoading={isUpdatingBlock}
						flex="1"
					>
						{isBlocked ? "Unblock" : "Block"}
					</Button>
					<Button
						bg={"white"}
						color={"black"}
						_hover={{ bg: "whiteAlpha.800" }}
						size={{ base: "xs", md: "sm" }}
						onClick={handleSendMessage}
						flex="1"
					>
						<BsFillSendFill />
					</Button>
				</Flex>
			)}

			{isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
		</VStack>
	);
};

export default ProfileHeader;
