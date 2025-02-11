// import React, { useState } from "react";
// import { addDoc, collection } from "firebase/firestore";
// import { firestore } from "../../firebase/firebase";
// import './chatBox.css';

// const MessageForm = ({ scroll, authUser, receiverUid, buttonText = "Send" }) => {
//   const [message, setMessage] = useState("");

//   const sendMessage = async (event) => {
//     event.preventDefault();

//     if (!message.trim()) {
//       alert("Enter a valid message");
//       return;
//     }

//     if (!authUser || !receiverUid) {
//       alert("Missing sender or receiver information");
//       return;
//     }

//     try {
//       await addDoc(collection(firestore, "privateMessages"), {
//         text: message,
//         avatar: authUser.profilePicURL,
//         name: authUser.fullName,
//         senderUid: authUser.uid,
//         receiverUid,
//         uid: authUser.uid,
//         unread: true,
//         users: [authUser.uid, receiverUid].sort(),
//         createdAt: Date.now(),
//       });

//       setMessage("");
//       scroll?.current?.scrollIntoView({ behavior: "smooth" });
//     } catch (error) {
//       console.error("Error sending message:", error);
//       alert("Failed to send the message.");
//     }
//   };

//   return (
//     <form onSubmit={sendMessage} className="send-message">
//       <label htmlFor="messageInput" hidden>
//         Enter Message
//       </label>
//       <input
//         id="messageInput"
//         name="messageInput"
//         type="text"
//         className="form-input__input"
//         placeholder="Type message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button type="submit">{buttonText}</button>
//     </form>
//   );
// };

// export default MessageForm;
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { Input, Button, Flex } from "@chakra-ui/react";  // Import Chakra components
import './chatBox.css';

const MessageForm = ({ scroll, authUser, receiverUid, buttonText = "Send" }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      alert("Enter a valid message");
      return;
    }

    if (!authUser || !receiverUid) {
      alert("Missing sender or receiver information");
      return;
    }

    try {
      await addDoc(collection(firestore, "privateMessages"), {
        text: message,
        avatar: authUser.profilePicURL,
        name: authUser.fullName,
        senderUid: authUser.uid,
        receiverUid,
        uid: authUser.uid,
        unread: true,
        users: [authUser.uid, receiverUid].sort(),
        createdAt: Date.now(),
      });

      setMessage("");
      scroll?.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message.");
    }
  };

  return (
    <form onSubmit={sendMessage} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <Flex align="center" gap={2}>
        {/* Styled Input */}
        <Input
          id="messageInput"
          name="messageInput"
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          borderColor="gray.300"
          focusBorderColor="blue.500"
          borderRadius="md"
          bg="white"
          boxShadow="sm"
          textColor="black"
        />
        {/* Styled Button */}
        <Button type="submit" colorScheme="blue">
          {buttonText}
        </Button>
      </Flex>
    </form>
  );
};

export default MessageForm;
