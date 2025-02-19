// import {
// 	Button,
// 	Flex,
// 	Modal,
// 	ModalBody,
// 	ModalCloseButton,
// 	ModalContent,
// 	ModalFooter,
// 	ModalHeader,
// 	ModalOverlay,
// 	Text,
// 	useDisclosure,
// } from "@chakra-ui/react";
// import useDeleteProfile from "../../hooks/useDeleteProfile";
// import useLogout from "../../hooks/useLogout";

// const DeleteProfile = () => {
// 	const { isOpen, onOpen, onClose } = useDisclosure();
// 	const { isDeleting, deleteProfile } = useDeleteProfile();
//     const { handleLogout, isLoggingOut } = useLogout();

// 	const handleDelete = async () => {
// 		await deleteProfile();
//         handleLogout();
// 		onClose();
// 	};

// 	return (
// 		<>
// 			<Button bg={"red.400"}
// 				color={"white"}
// 				w='full'
// 				size='sm'
// 				_hover={{ bg: "red.500" }} 
// 				onClick={onOpen}
// 				mt={5}
// 			>
// 				Delete Account
// 			</Button>

// 			<Modal isOpen={isOpen} onClose={onClose}>
// 				<ModalOverlay />
// 				<ModalContent bg="black" border="1px solid gray">
// 					<ModalHeader>Delete Account</ModalHeader>
// 					<ModalCloseButton />
// 					<ModalBody>
// 						<Text fontSize="md" color="red.400">
// 							Are you sure? This action is irreversible.
// 						</Text>
// 					</ModalBody>
// 					<ModalFooter>
// 						<Button colorScheme="gray" onClick={onClose} isDisabled={isDeleting}>
// 							Cancel
// 						</Button>
// 						<Button colorScheme="red" onClick={handleDelete} isLoading={isDeleting} ml={3}>
// 							Delete
// 						</Button>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>
// 		</>
// 	);
// };

// export default DeleteProfile;
import {
	MenuItem,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	Button,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import useDeleteProfile from "../../hooks/useDeleteProfile";
import useLogout from "../../hooks/useLogout";

const DeleteProfile = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isDeleting, deleteProfile } = useDeleteProfile();
    const { handleLogout } = useLogout();

	const handleDelete = async () => {
		await deleteProfile();
        handleLogout();
		onClose();
	};

	return (
		<>
			<MenuItem icon={<DeleteIcon />} color="red.400" onClick={onOpen}>
				Delete Account
			</MenuItem>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg="black" border="1px solid gray">
					<ModalHeader>Delete Account</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text fontSize="md" color="red.400">
							Are you sure? This action is irreversible.
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="gray" onClick={onClose} isDisabled={isDeleting}>
							Cancel
						</Button>
						<Button colorScheme="red" onClick={handleDelete} isLoading={isDeleting} ml={3}>
							Delete
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeleteProfile;
