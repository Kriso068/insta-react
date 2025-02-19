
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { Input, Button, Flex } from "@chakra-ui/react";
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
        name: authUser.username,
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
      <Flex align="center" gap={2} justifyContent={"space-between"} px={2} position={"fixed"} bottom={82} w={"80%"}>
        <Input
          id="messageInput"
          name="messageInput"
          type="text"
          textColor="black"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          borderColor="gray.300"
          focusBorderColor="blue.500"
          borderRadius="md"
          bg="white"
          boxShadow="sm"
          width={"75%"}
          
        />
        <Button type="submit" 
          bg={"white"}
					color={"black"}
					_hover={{ bg: "whiteAlpha.800" }}
          width={"24%"}
          p={0}
          position={"end"}
        >
          
          {buttonText}
        </Button>
      </Flex>
    </form>
  );
};

export default MessageForm;
