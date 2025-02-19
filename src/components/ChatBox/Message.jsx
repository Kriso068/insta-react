
import React from "react";
import { IconButton, Flex, Input } from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import './chatBox.css';

const Message = ({
    message,
    authUser,
    onEdit,
    onDelete,
    isEditing,
    editText,
    setEditText,
    editMessage,
    cancelEditing
}) => {
    
    const isUserMessage = message.senderUid === authUser?.uid;
   
    return (
        <div className={`chat-bubble ${isUserMessage ? "right" : ""}`}>
            <img className="chat-bubble__left" src={message.avatar} alt="user avatar" />
            <div className="chat-bubble__right">
                <p className="user-name">{message.name}</p>


                {/* Inline edit input */}
                {isEditing ? (
                    <Flex align="center" gap={2}>
                        <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                        />
                        <IconButton
                            icon={<CheckIcon />}
                            colorScheme="green"
                            size="sm"
                            aria-label="Save edit"
                            onClick={editMessage}
                        />
                        <IconButton
                            icon={<CloseIcon />}
                            colorScheme="red"
                            size="sm"
                            aria-label="Cancel edit"
                            onClick={cancelEditing}
                        />
                    </Flex>
                ) : (
                    <p className="user-message">{message.text}</p>
                )}

                {/* Edit and Delete icons */}
                {isUserMessage && !isEditing && (
                    <Flex className="message-actions" gap={2}>
                        <IconButton
                            icon={<EditIcon />}
                            colorScheme="blue"
                            size="sm"
                            aria-label="Edit message"
                            onClick={() => onEdit(message)}
                        />
                        <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            size="sm"
                            aria-label="Delete message"
                            onClick={() => onDelete(message.id)}
                        />
                    </Flex>
                )}
            </div>
        </div>
    );
};

export default Message;

