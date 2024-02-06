import { Box, Flex, Text, Link} from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3Gap, BsSuitHeart } from "react-icons/bs";
import { Link as RouterLink, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useUserProfileStore from "../../store/userProfileStore";


const ProfileTabs = () => {
    const authUser = useAuthStore((state) => state.user);
    const location = useLocation();
    const userProfile = useUserProfileStore((state) => state.userProfile);

    const isPageActive = (pathname) => {
        return location.pathname === pathname;
    }

  return (
    <Flex 
        w={"full"}
        justifyContent={"center"}
        gap={{base:4, sm:10}}
        textTransform={'uppercase'}
        fontWeight={"bold"}
    >
        <Flex 
            borderTop={isPageActive(`/${authUser?.username}`) ? "2px solid white" : "none"}
            alignItems={"center"} 
            p={3} 
            gap={1} 
            cursor={"pointer"}
        >
            <Link 
                display={"flex"}
				to={`/${userProfile?.username}`}
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
        {authUser?.uid === userProfile?.uid && (
            <>
                 <Flex 
                    borderTop={isPageActive(`/${authUser?.username}/saves`) ? "2px solid white" : "none"}
                    alignItems={"center"}
                    p={3}
                    gap={1}
                    cursor={"pointer"}
                >
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
                <Flex 
                    borderTop={isPageActive(`/${authUser?.username}/likes`) ? "2px solid white" : "none"}
                    alignItems={"center"}
                    p={3}
                    gap={1}
                    cursor={"pointer"}>
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
            </>
        )}
    </Flex>
  )
}

export default ProfileTabs