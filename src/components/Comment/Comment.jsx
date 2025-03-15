
import { 
	Avatar, 
	Flex, 
	IconButton, 
	Input, 
	Text, 
	Menu, 
	MenuButton, 
	MenuList, 
	MenuItem 
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import usePostComment from "../../hooks/usePostComment";
import useAuthStore from "../../store/authStore";
import { useState } from "react";
import { timeAgo } from "../../utils/timeAgo";

const Comment = ({ comment }) => {
	const { userProfile, isLoading } = useGetUserProfileById(comment.createdBy);
	const { handleDeleteComment, handleEditComment } = usePostComment();
	const authUser = useAuthStore((state) => state.user);

	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(comment.comment);
	const isUserComment = authUser?.uid === comment.createdBy;

	if (isLoading) return null;

	// Check if the user exists or is deleted
	const isDeletedUser = !userProfile || comment.createdBy === "deleted_user";

	// Fallback values for deleted users
	const username = isDeletedUser ? "Deleted User" : userProfile?.username;
	const avatarURL = isDeletedUser ? "/default-avatar.png" : userProfile?.profilePicURL;

	const saveEdit = () => {
		handleEditComment(comment.postId, comment.id, editText);
		setIsEditing(false);
	};

	return (
		<Flex gap={4} alignItems="center">
			<Avatar src={avatarURL} size={"sm"} />
			<Flex direction={"column"} w="full">
				<Flex alignItems={"center"} justifyContent={"space-between"}>
					<Flex alignItems="center" gap={2}>
						<Text fontWeight={"bold"} fontSize={12} color={isDeletedUser ? "gray.500" : "white"}>
							{username}
						</Text>
						{isEditing ? (
							<Input 
								value={editText} 
								onChange={(e) => setEditText(e.target.value)} 
								size="sm" 
							/>
						) : (
							<Text fontSize={14}>{comment.comment}</Text>
						)}
					</Flex>

					{isUserComment && !isDeletedUser && !isEditing && (
						<Menu>
							<MenuButton as={IconButton} icon={<BsThreeDotsVertical />} size="xs" variant="ghost" />
							<MenuList bg="gray.800" border="1px solid gray">
								<MenuItem icon={<EditIcon />} onClick={() => setIsEditing(true)}>
									Edit
								</MenuItem>
								<MenuItem 
									icon={<DeleteIcon />} 
									color="red.400" 
									onClick={() => handleDeleteComment(comment.postId, comment.id)}
								>
									Delete
								</MenuItem>
							</MenuList>
						</Menu>
					)}
				</Flex>

				<Text fontSize={12} color={"gray"}>{timeAgo(comment.createdAt)}</Text>

				{/* Inline edit buttons */}
				{isEditing && (
					<Flex gap={2} mt={1}>
						<IconButton icon={<CheckIcon />} size="xs" onClick={saveEdit} />
						<IconButton icon={<CloseIcon />} size="xs" onClick={() => setIsEditing(false)} />
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};

export default Comment;
