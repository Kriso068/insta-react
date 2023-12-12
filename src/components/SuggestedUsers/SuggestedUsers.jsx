import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react"
import SuggestedHeader from "./SuggestedHeader"
import SuggestedUser from "./SuggestedUser"

const SuggestedUsers = () => {
  return (
    <VStack py={8} px={6} gap={4}>
        <SuggestedHeader />
        <Flex 
            alignItems={"center"} 
            justifyContent={"space-between"}
            w={"full"}
        >
            <Text fontSize={12} fontWeight={"bold"} color={"gray.500"}>
                Suggested for you
            </Text>
            <Text fontSize={12} fontWeight={"bold"} _hover={{color:"gray.400"}} cursor={"pointer"}>
                See All
            </Text>
        </Flex>
        <SuggestedUser name="Dan Abramov" followers={500} avatar='https://bit.ly/dan-abramov'/>
        <SuggestedUser name="Ryan Florence" followers={3520} avatar='https://bit.ly/ryan-florence'/>
        <SuggestedUser name="Christaian Nwanda" followers={1982} avatar='https://bit.ly/code-beast'/>


        <Box fontSize={12} color={"gray.500"} mt={5} alignSelf={"start"}>
            Built by{" "}
            <Link
                href='#' 
                target="_blank" 
                color={'blue.500'} 
                fontSize={14}
            >Kriso-068</Link>
        </Box>
    </VStack>
  )
}

export default SuggestedUsers