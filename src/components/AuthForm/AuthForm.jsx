// import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react'
// import { useState } from 'react'
// import Login from './Login';
// import Signup from './Signup';
// import GoogleAuth from './GoogleAuth';

// const AuthForm = () => {

//     const [isLogin, setIsLogin] = useState(true);

//     return (
//     <>
//         <Box border={"1px solid gray"} borderRadius={4} padding={5}>
//             <VStack spacing={4}>
//                 <Image src='/logo.png' h={24} cursor={'pointer'} alt='PixFlow'/>
               

//                 {isLogin ? <Login /> : <Signup />}


//                 {/* -------------------OR---------------------- */}

//                 <Flex alignItems={"center"} justifyContent={"center"} my={4} gap={1} w={"full"}>
//                     <Box flex={2} h={'1px'} bg={"gray.400"} />
//                         <Text mx={1} color={"white"}>
//                             OR
//                         </Text>
//                     <Box flex={2} h={'1px'} bg={"gray.400"} />
//                 </Flex>
//                 <GoogleAuth prefix={isLogin ? "Log in" : "Sign up"}/>
//             </VStack>
//         </Box>
//         <Box border={"1px solid gray"} borderRadius={4} padding={5}>
//             <Flex alignItems={"center"} justifyContent={"center"}>
//                 <Box mx={2} fontSize={14}>
//                     {isLogin ? "Don't have an account?" : "Already have an accouunt"}
//                 </Box>
//                 <Box onClick={() => setIsLogin(!isLogin)} color={"blue.500"} cursor={"pointer"}>
//                     {isLogin ? "Sign Up" : "Log in"}
//                 </Box>
//             </Flex>
//         </Box>
//     </>
//   )
// }

// export default AuthForm

import { Box, Flex, Image, Text, VStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import GoogleAuth from './GoogleAuth';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [canFillForm, setCanFillForm] = useState(false);

  // Close modal, handle accept/decline
  const closeModal = (accept) => {
    if (accept) {
      setCanFillForm(true);
    } else {
      setCanFillForm(false);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Popup Modal */}
      <Modal isOpen={isOpen} onClose={() => closeModal(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={"red"} textAlign={"center"}>Demo Site</ModalHeader>
          <ModalBody>
            <Flex direction={"column"}>
                <Box>
                    This is a demo site and not a real social media platform.
                </Box>
                <Flex direction={"column"} my={3}>
                    <Box>
                        For Login :
                    </Box>
                    <Flex direction={"row"}>
                        <Box>
                            You can use as email :
                        </Box>
                        <Box color={"grey"}>
                            &nbsp;test1@test.test to test4@test.test
                        </Box>
                    </Flex>
                    <Flex direction={"row"}>
                        <Box>
                        And for password :
                        </Box>
                        <Box color="grey">
                            &nbsp;Test123456789@ 
                        </Box>
                    </Flex>
                </Flex>
                <Box>
                    Would you like to proceed and interact with the demo account?
                </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => closeModal(true)}>Accept</Button>
            <Button variant="ghost" color={"red"} onClick={() => closeModal(false)} ml={3}>Decline</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Auth Form Box */}
      <Box border={"1px solid gray"} borderRadius={4} padding={5}>
        <VStack spacing={4}>
          <Image src='/logo.png' h={24} cursor={'pointer'} alt='PixFlow'/>
          
          {/* Display login/signup form based on the state */}
          {isLogin ? (
            <Login canFillForm={canFillForm} />
          ) : (
            <Signup canFillForm={canFillForm} />
          )}

          {/* -------------------OR---------------------- */}
          <Flex alignItems={'center'} justifyContent={'center'} my={4} gap={1} w={'full'}>
            <Box flex={2} h={'1px'} bg={'gray.400'} />
            <Text mx={1} color={'white'}>OR</Text>
            <Box flex={2} h={'1px'} bg={'gray.400'} />
          </Flex>

          <GoogleAuth prefix={isLogin ? 'Log in' : 'Sign up'} />
        </VStack>
      </Box>

      <Box border={"1px solid gray"} borderRadius={4} padding={5}>
        <Flex alignItems={'center'} justifyContent={'center'}>
          <Box mx={2} fontSize={14}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Box>
          <Box onClick={() => setIsLogin(!isLogin)} color={'blue.500'} cursor={'pointer'}>
            {isLogin ? 'Sign Up' : 'Log in'}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default AuthForm;

