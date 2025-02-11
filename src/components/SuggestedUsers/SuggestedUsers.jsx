
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import SuggestedHeader from "./SuggestedHeader";
import SuggestedUser from "./SuggestedUser";
import useGetSuggestedUsers from "../../hooks/useGetSuggestedUsers";
import { useState, useEffect } from "react";

const SuggestedUsers = () => {
    const { isLoading, suggestedUsers: initialSuggestedUsers } = useGetSuggestedUsers();
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    // Set initial users when data is loaded
    useEffect(() => {
        if (!isLoading) {
            setSuggestedUsers(initialSuggestedUsers);
        }
    }, [isLoading, initialSuggestedUsers]);

    const updateUser = (updatedUser) => {
        setSuggestedUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
    };

    if (isLoading) return null;

    return (
        <VStack py={8} px={6} gap={4}>
            <SuggestedHeader />

            {suggestedUsers.length !== 0 && (
                <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
                    <Text fontSize={12} fontWeight={"bold"} color={"gray.500"}>
                        Suggested for you
                    </Text>
                    <Text fontSize={12} fontWeight={"bold"} _hover={{ color: "gray.400" }} cursor={"pointer"}>
                        See All
                    </Text>
                </Flex>
            )}

            {suggestedUsers.map((user) => (
                <SuggestedUser user={user} key={user.id} setUser={updateUser} />
            ))}

            <Box fontSize={12} color={"gray.500"} mt={5} alignSelf={"start"}>
                Built by{" "}
                <Link href="#" target="_blank" color={"blue.500"} fontSize={14}>
                    Kriso-068
                </Link>
            </Box>
        </VStack>
    );
};

export default SuggestedUsers;
