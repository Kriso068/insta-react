// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import { Alert, AlertIcon, Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
// import { useState } from "react";
// import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

// const Signup = () => {
//     const [inputs, setInputs] = useState({
//         fullName: '',
//         username: '',
//         email: '',
//         password: '',
//     });

//     const [showPassword, setShowPassword] = useState(false);
//     const [passwordError, setPasswordError] = useState('');

//     const { loading, error, signup } = useSignUpWithEmailAndPassword();

//     // Function to handle password change
//     const handlePasswordChange = (e) => {
//         const password = e.target.value;
//         setInputs({ ...inputs, password });
        
//         // Manual validation
//         if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,64}/.test(password)) {
//             setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be between 12 and 64 characters long.');
//         } else {
//             setPasswordError('');
//         }
//     };

//     // Function to handle sign up submission
//     const handleSignup = () => {
//         if (!passwordError) {
//             // Only proceed with sign up if there are no password errors
//             signup(inputs);
//         }
//     };

//     return (
//         <>
//             <Input 
//                 placeholder="Email"
//                 fontSize={14}
//                 type="email"
//                 value={inputs.email}
//                 size={"sm"}
//                 onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
//             />
//             <Input 
//                 placeholder="Username"
//                 fontSize={14}
//                 type="text"
//                 value={inputs.username}
//                 size={"sm"}
//                 onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
//             />
//             <Input 
//                 placeholder="Full Name"
//                 fontSize={14}
//                 type="text"
//                 value={inputs.fullName}
//                 size={"sm"}
//                 onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
//             />
//             <InputGroup>
//                 <Input 
//                     placeholder="Password"
//                     fontSize={14}
//                     type={showPassword ? "text" : "password"}
//                     value={inputs.password}
//                     size={"sm"}
//                     onChange={handlePasswordChange}
//                 />
//                 <InputRightElement h={"full"}>
//                     <Button variant={"ghost"} size={"sm"} onClick={() => setShowPassword(!showPassword)}>
//                         {showPassword ? <ViewIcon/> : <ViewOffIcon /> }
//                     </Button>
//                 </InputRightElement>
//             </InputGroup>

//             {error && (
//                 <Alert status={"error"} fontSize={13} p={2} borderRadius={4}>
//                     <AlertIcon fontSize={12} />
//                     {error.message}
//                 </Alert>
//             )}

//             {passwordError && (
//                 <Alert status={"error"} fontSize={13} p={2} borderRadius={4}>
//                     <AlertIcon fontSize={12} />
//                     {passwordError}
//                 </Alert>
//             )}

//             <Button 
//                 w={'full'}
//                 colorScheme='blue'
//                 size={"sm"}
//                 fontSize={14}
//                 isLoading={loading}
//                 onClick={handleSignup} // Changed from () => signup(inputs) to handleSignup
//             >
//                 Sign Up
//             </Button>
//         </>
//     );
// }

// export default Signup;


import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

const Signup = ({ canFillForm }) => {
  const [inputs, setInputs] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { loading, error, signup } = useSignUpWithEmailAndPassword();

  // Function to handle password change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setInputs({ ...inputs, password });

    // Manual validation
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,64}/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be between 12 and 64 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const handleSignup = () => {
    if (!passwordError) {
      
      signup(inputs);
    }
  };

  return (
    <>
      <Input
        placeholder="Email"
        fontSize={14}
        type="email"
        value={inputs.email}
        size={"sm"}
        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
        isDisabled={!canFillForm}
      />
      <Input
        placeholder="Username"
        fontSize={14}
        type="text"
        value={inputs.username}
        size={"sm"}
        onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
        isDisabled={!canFillForm}
      />
      <Input
        placeholder="Full Name"
        fontSize={14}
        type="text"
        value={inputs.fullName}
        size={"sm"}
        onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
        isDisabled={!canFillForm}
      />
      <InputGroup>
        <Input
          placeholder="Password"
          fontSize={14}
          type={showPassword ? "text" : "password"}
          value={inputs.password}
          size={"sm"}
          onChange={handlePasswordChange}
          isDisabled={!canFillForm}
        />
        <InputRightElement h={"full"}>
          <Button variant={"ghost"} size={"sm"} onClick={() => setShowPassword(!showPassword)} isDisabled={!canFillForm}>
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>

      {error && (
        <Alert status={"error"} fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {error.message}
        </Alert>
      )}

      {passwordError && (
        <Alert status={"error"} fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {passwordError}
        </Alert>
      )}

      <Button
        w={'full'}
        colorScheme='blue'
        size={"sm"}
        fontSize={14}
        isLoading={loading}
        onClick={handleSignup}
        isDisabled={!canFillForm} 
      >
        Sign Up
      </Button>
    </>
  );
}

export default Signup;
