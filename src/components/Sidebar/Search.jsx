import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tooltip,
	useDisclosure,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import useSearchUser from "../../hooks/useSearchUser";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";

const Search = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { users, isLoading, getUserProfile, setUsers } = useSearchUser();
	const [searchQuery, setSearchQuery] = useState(""); 
	const [debouncedQuery, setDebouncedQuery] = useState(""); 
	const [selectedIndex, setSelectedIndex] = useState(0); 
	const navigate = useNavigate();

	// Prevent infinite loops
	const stableGetUserProfile = useCallback(getUserProfile, []);

	const handleInputChange = (e) => {
		setSearchQuery(e.target.value);
		setSelectedIndex(0); 
	};

	// Debounce Effect: Wait 300ms before setting debounced query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Fetch users only when the debounced query changes
	useEffect(() => {
		if (debouncedQuery.trim()) {
			stableGetUserProfile(debouncedQuery);
		} else {
			setUsers([]); 
		}
	}, [debouncedQuery, stableGetUserProfile, setUsers]);

	// Close modal and reset search
	const handleCloseModal = () => {
		onClose();
		setUsers([]);
		setSearchQuery("");
		setSelectedIndex(0);
	};

	// Handle keyboard navigation
	const handleKeyDown = (e) => {
		if (!users.length) return;

		if (e.key === "ArrowDown") {
			setSelectedIndex((prev) => (prev + 1) % users.length);
		} else if (e.key === "ArrowUp") {
			setSelectedIndex((prev) => (prev - 1 + users.length) % users.length);
		} else if (e.key === "Enter") {
			handleSelectUser(users[selectedIndex]);
		}
	};

	
	const handleSelectUser = (user) => {
		handleCloseModal();
		navigate(`/${user.username}`);
	};

	return (
		<>
			<Tooltip
				hasArrow
				label={"Search"}
				placement="right"
				ml={1}
				openDelay={500}
				display={{ base: "block", md: "none" }}
			>
				<Flex
					alignItems={"center"}
					gap={4}
					_hover={{ bg: "whiteAlpha.400" }}
					borderRadius={6}
					p={2}
					w={{ base: 10, md: "full" }}
					justifyContent={{ base: "center", md: "flex-start" }}
					onClick={onOpen}
				>
					<SearchLogo />
					<Box display={{ base: "none", md: "block" }}>Search</Box>
				</Flex>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={handleCloseModal} motionPreset="slideInLeft">
				<ModalOverlay />
				<ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
					<ModalHeader>Search user</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<FormLabel>Username</FormLabel>
							<Input
								placeholder="Type a username..."
								value={searchQuery} 
								onChange={handleInputChange} 
								onKeyDown={handleKeyDown} 
							/>
						</FormControl>

						{/* Show loading spinner while fetching results */}
						{isLoading && (
							<Flex justifyContent="center" mt={4}>
								<Spinner size="sm" />
							</Flex>
						)}

						{/* Display search results (limit to 5 users) */}
						{!isLoading && users.length > 0 ? (
							<Box mt={4}>
								{users.slice(0, 5).map((user, index) => (
									<Box
										key={user.uid}
										bg={selectedIndex === index ? "whiteAlpha.300" : "transparent"}
										p={2}
										borderRadius="md"
										cursor="pointer"
										onClick={() => handleSelectUser(user)}
										_hover={{ bg: "whiteAlpha.400" }}
									>
										<SuggestedUser user={user} setUser={setUsers} />
									</Box>
								))}
							</Box>
						) : (
							!isLoading && searchQuery && (
								<Text color="gray.400" mt={4} textAlign="center">
									No users found
								</Text>
							)
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Search;
