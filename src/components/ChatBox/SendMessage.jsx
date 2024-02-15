// import React, { useState } from "react";
// import { addDoc, collection } from "firebase/firestore";
// import { firestore } from "../../firebase/firebase";
// import useAuthStore from "../../store/authStore";

// const SendMessage = ({ scroll }) => {

//   const authUser = useAuthStore((state) => state.user);
//   const [message, setMessage] = useState("");

//   const sendMessage = async (event) => {
//     event.preventDefault();
//     if (message.trim() === "") {
//       alert("Enter valid message");
//       return;
//     }
  
//     await addDoc(collection(firestore, "messages"), {
//       text: message,
//       name: authUser.fullName,
//       avatar: authUser.profilePicURL,
//       uid: authUser.uid,
//       createdAt: Date.now(),
//     });
//     setMessage("");
//     scroll.current.scrollIntoView({ behavior: "smooth" });
//   };
//   return (
//     <form onSubmit={(event) => sendMessage(event)} className="send-message">
//       <label htmlFor="messageInput" hidden>
//         Enter Message
//       </label>
//       <input
//         id="messageInput"
//         name="messageInput"
//         type="text"
//         className="form-input__input"
//         placeholder="type message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button type="submit">Send</button>
//     </form>
//   );
// };

// export default SendMessage;

// SendMessage.jsx

import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import './chatBox.css';


const SendMessage = ({ scroll, authUser, userProfileUid }) => {

  const [message, setMessage] = useState("");
 

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }

    const users = [authUser?.uid, userProfileUid]; 

  
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
