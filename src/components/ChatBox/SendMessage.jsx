
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import './chatBox.css';


const SendMessage = ({ scroll, authUser, senderUserProfile }) => {

  const [message, setMessage] = useState("");
  const users = [authUser?.uid, senderUserProfile]; 

 
  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }


  
    await addDoc(collection(firestore, "privateMessages"), {
      text: message,
      avatar: authUser.profilePicURL,
      name: authUser.fullName,
      users: users.sort(),
      uid:authUser.uid,
      unread: true,
      createdAt: Date.now(),
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

//   console.log("authUser.uid:", authUser.uid);
// console.log("users:", users);
// console.log("Date.now():", Date.now());

  // console.log("Message:", message);

//   console.log("authUser:", authUser);
// console.log("authUser.profilePicURL:", authUser.profilePicURL);
// console.log("authUser.fullName:", authUser.fullName);



  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;
