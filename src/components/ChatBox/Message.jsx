import {
    IconButton,
    Flex,
    Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import './chatBox.css';
import { timeAgo } from "../../utils/timeAgo";

const Message = ({
    message,
    authUser,
    onEdit,
    onDelete,
    isEditing,
    editText,
    setEditText,
    editMessage,
    cancelEditing,
    isLastMessage
}) => {
    
    const isUserMessage = message.senderUid === authUser?.uid;
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Handle opening the edit modal and setting the correct message text
    const handleOpenEditModal = () => {
        if (!message.id) {
            console.error("Error: Message ID is missing.");
            return;
        }

        setEditText(message.text);
        onEdit(message); 
        onOpen(); 
    };

    // Handle saving the edited message
    const handleSaveEdit = () => {
        if (!editText.trim()) {
            alert("Message cannot be empty.");
            return;
        }
        
        editMessage(); 
        onClose(); 
    };

    return (
        
        <div className={`chat-bubble ${isUserMessage ? "right" : ""}`}>
            <img className="chat-bubble__left" src={message.avatar} alt="user avatar" />
            <div className="chat-bubble__right">
                {/* Username & 3-dot menu on the same row */}
                <Flex justify="space-between" align="center">
                    <p className="user-name">{message.name}</p>
                    
                    {isUserMessage && isLastMessage && !isEditing && (
                        <Menu>
                            <MenuButton as={IconButton} icon={<BsThreeDotsVertical />} size="sm" variant="ghost" color={"black"}/>
                            <MenuList bg="gray.800" border="1px solid gray">
                                <MenuItem icon={<EditIcon />} onClick={handleOpenEditModal} color={"white"}>
                                    Edit
                                </MenuItem>
                                <MenuItem 
                                    icon={<DeleteIcon />} 
                                    color="red.400" 
                                    onClick={() => onDelete(message.id)}
                                >
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                </Flex>

                {/* Message Content */}
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
                            onClick={handleSaveEdit}
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
                    
                    <Flex direction={"column"}>
                        <p className="user-message">{message.text}</p>
                        <span className="message-time">{timeAgo(message.createdAt)}</span>
                    </Flex>
                )}

            </div>

            {/* Edit Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Message</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            placeholder="Edit your message..."
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" mr={3} onClick={handleSaveEdit}>
                            Save
                        </Button>
                        <Button color="red.500" _hover={{ bg: "red.100" }} onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Message;

