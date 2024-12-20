import {
  Avatar,
  HStack,
  Input,
  InputGroup,
  Text,
  InputRightElement,
  IconButton,
  Box,
} from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiSearch, FiChevronDown, FiInfo } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import { ChatApi } from "../../../apis/chatApi";
import { loadAllMessage, loadAllRoom } from "../../../Redux/slices/chatSlice";
import { HiUserAdd } from "react-icons/hi";
import { RiInformationFill } from "react-icons/ri";
const MsgBoxHeader = ({
  boxchat,
  selectedChat,
  searchQuery,
  setSearchQuery,
  setSearchResults,
  setCurrentResultIndex,
  handleKeyDown,
  searchResults,
  currentResultIndex,
  goToPreviousResult,
  goToNextResult,
  toggleInfoPanel,
  dispatch,
  userDetail,
  socket,
  onOpen,
  setAddState
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState("");
  const inputRef = useRef(null);
  const chat = boxchat.find((chat) => chat._id === selectedChat);
  const chatName =
    chat?.type === "user" ? chat?.otherUser?.userName : chat?.groupChatName;

  const handleChatClick = () => {
    if (chat.type === "user") {
      navigate(`/account/guest/${chat?.otherUser?._id}`);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value === "") {
      setSearchResults([]);
      setCurrentResultIndex(0);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setGroupName(chat?.groupChatName); // Set the current group name for editing
  };

  const handleSaveClick = async () => {
    if (groupName !== chat?.groupChatName) {
      await ChatApi.editGroupChatName("chat/editGroupChatName", {
        roomId: chat._id,
        newGroupChatName: groupName,
      });
      setTimeout(() => {
        dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
        dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
        socket.emit("sendMessage", {
          NguoiGui_id: userDetail._id,
          NhomChat_id: selectedChat,
          type: "notify",
        });
      }, 700);
    }

    setIsEditing(false);
  };
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus(); // Focus vào input khi đang chỉnh sửa
    }
  }, [isEditing]);
  return (
    <HStack
      mb={4}
      justify="space-between"
      borderBottom="1px solid #DFE0DC"
      p={4}
    >
      <HStack spacing={3} w="50%">
        <Avatar name="Username" src={chat?.otherUser?.avtPic ? chat.otherUser.avtPic.display_url : '/src/assets/no-avt.png'} />
        {isEditing ? (
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onBlur={handleSaveClick} // Save when the input loses focus
            width={`${groupName.length}ch`}
            variant="filled"
            border={"none"}
            ref={inputRef}
          />
        ) : (
          <Text fontWeight="bold" onClick={handleChatClick} cursor="pointer">
            {chatName}
          </Text>
        )}
        {chat?.type === "group" && (
          <Box fontSize="18px" cursor="pointer" onClick={handleEditClick}>
            <BiEditAlt />
          </Box>
        )}
      </HStack>

      <InputGroup w="50%"  border="1px solid #DFE0DC" borderRadius={'10px'}  bg={"#e7ebf6"} >
        <Input
          placeholder="Tìm kiếm tin nhắn.."
          value={searchQuery}
          _placeholder={{
            fontWeight: 500
          }}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement>
          <FiSearch />
        </InputRightElement>
      </InputGroup>

      <HStack spacing={2}>
        {searchResults.length > 0 && (
          <>
            <Box w="70px" textAlign="right">
              <Text>{`${currentResultIndex + 1}/${searchResults.length}`}</Text>
            </Box>
            <IconButton
              icon={<FiChevronUp />}
              aria-label="Previous Result"
              variant="ghost"
              onClick={goToPreviousResult}
              isDisabled={searchResults.length === 0}
            />
            <IconButton
              icon={<FiChevronDown />}
              aria-label="Next Result"
              variant="ghost"
              onClick={goToNextResult}
              isDisabled={searchResults.length === 0}
            />
          </>
        )}
        {chat?.type == "group" && (
          <IconButton
            icon={<HiUserAdd />}
            fontSize={"22px"}
            aria-label="Info"
             onClick={()=>{
              setAddState('addMember')
              onOpen()
             }}
            variant="ghost"
            ml={"5px"}
          />
        )}

        <IconButton
          icon={<RiInformationFill />}
          aria-label="Info"
          onClick={toggleInfoPanel}
          variant="ghost"
          fontSize={'20px'}
          color={'#2d5be4'}
          _hover={{
            bg: 'none',
            transform: 'scale(1.05)'
          }}
        />
      </HStack>
    </HStack>
  );
};

export default MsgBoxHeader;
