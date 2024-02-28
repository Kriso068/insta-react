import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import './chatBox.css';


const ReplyMessage = ({ scroll, authUser, receiverUid }) => {

  const [message, setMessage] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }

    const users = [authUser?.uid, receiverUid]; 

    await addDoc(collection(firestore, "privateMessages"), {
      text: message,
      avatar: authUser.profilePicURL,
      name: authUser.fullName,
      senderUid: authUser.uid,
      receiverUid: receiverUid,
      unread: true,
      users: users.sort(),
      createdAt: Date.now(),
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };



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

export default ReplyMessage;
