import React from "react";
import useAuthStore from "../../store/authStore";
import './chatBox.css';


const Message = ({ message }) => {

    const authUser = useAuthStore((state) => state.user);
 
  return (
    <div
      className={`chat-bubble ${message?.uid === authUser?.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;