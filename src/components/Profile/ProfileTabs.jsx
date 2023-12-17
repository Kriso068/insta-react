import { Box, Flex, Text, Link} from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3Gap, BsSuitHeart } from "react-icons/bs";
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";


const ProfileTabs = () => {
    const authUser = useAuthStore((state) => state.user);
  return (
    <Flex 
        w={"full"}
        justifyContent={"center"}
        gap={{base:4, sm:10}}
        textTransform={'uppercase'}
        fontWeight={"bold"}
    >
        <Flex borderTop={'1px solid white'} alignItems={"center"} p={3} gap={1} cursor={"pointer"}>
            <Link 
                display={"flex"}
				to={`/${authUser?.username}`}
				as={RouterLink}
            >
                <Box fontSize={20}>
                    <BsGrid3X3Gap />
                </Box>
                <Text fontSize={12} display={{base:"none", sm:"block"}}>
                    Posts
            </Text>
            </Link>
        </Flex>
        <Flex alignItems={"center"} p={3} gap={1} cursor={"pointer"}>
            <Link 
                display={"flex"}
				to={`/${authUser?.username}/saves`}
				as={RouterLink}
            >
                <Box fontSize={20}>
                    <BsBookmark />
                </Box>
                <Text fontSize={12} display={{base:"none", sm:"block"}}>
                    Saved
                </Text>
            </Link>
        </Flex>
        <Flex alignItems={"center"} p={3} gap={1} cursor={"pointer"}>
            <Link 
                display={"flex"}
				to={`/${authUser?.username}/likes`}
				as={RouterLink}
            >
                <Box fontSize={20}>
                    <BsSuitHeart  fontWeight={'bold'}/>
                </Box>
                <Text fontSize={12} display={{base:"none", sm:"block"}}>
                    Likes
                </Text>
            </Link>
        </Flex>
    </Flex>
  )
}

export default ProfileTabs