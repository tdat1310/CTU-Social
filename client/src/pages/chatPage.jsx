/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import {
  VStack,
  Box,
  Input,
  Flex,
  InputGroup,
  InputRightElement,
  Button,
  useDisclosure,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { TiPlus } from "react-icons/ti";
import { FiSearch, FiPlus } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import Header from "../components/common/header";
import Spinner from "../components/common/spinner";
import MessageBox from "../components/chat/messageBox";
import ChatBox from "../components/chat/chatBox";
import { useDispatch, useSelector } from "react-redux";
import {
  clearRefBoxChat,
  loadAllMessage,
  loadAllRoom,
} from "../Redux/slices/chatSlice";
import InfoChatModal from "../components/Modal/infoChatModal";
import { SocketContext } from "../provider/socketContext";
import ListUserModal from "../components/Modal/listUserModal/listUserModal";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaUserFriends } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

import { FaPlus } from "react-icons/fa";
const ChatPage = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [addState, setAddState] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho tìm kiếm
  const refBoxChat = useSelector((state) => state.chat.refBoxChat);
  const userDetail = useSelector((state) => state.auth.userDetail);
  const [selectedChat, setSelectedChat] = useState(() => {
    const room_id = refBoxChat.room_id;
    //  dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
    dispatch(clearRefBoxChat());
    return room_id || null;
  });
  const boxChatList = useSelector((state) => state.chat.boxChat) || [];

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
    // if(selectedChat!==null)    dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
    boxChatList.forEach((boxChat) => {
      socket.emit("join_room", { room_id: boxChat._id });
    });
    socket.on("newGroupChat", (data) => {
      //console.log(data)
      dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
       dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
    });
    // socket.on("new_message", ()=>{
    //    dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
    // });
    socket.on("AddMemberGroupChat", (data) => {
      dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
    });
    socket.on("deteleBoxChat", (data) => {
      dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
      //  setSelectedChat(null)
    });
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Lọc danh sách chat dựa trên tên (roomName)
  const filteredChats = boxChatList.filter((boxChat) => {
    const chatName =
      boxChat.type === "user"
        ? boxChat.otherUser.userName // Truy cập vào otherUser.userName nếu là user
        : boxChat.groupChatName; // Lấy groupChatName nếu là group

    return chatName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedChats = [...filteredChats].sort((a, b) => {
    const aDate =
      a.latestMsg !== null
        ? new Date(a.latestMsg.createdAt)
        : new Date(a.createdAt);
    const bDate =
      b.latestMsg !== null
        ? new Date(b.latestMsg.createdAt)
        : new Date(b.createdAt);
    return bDate - aDate;
  });

  const toggleInfoPanel = () => setShowInfo(!showInfo);

  if (loading) {
    return <Spinner />;
  }

  return (
    <VStack spacing={0} align="stretch" h="100vh" overflow="hidden">
      <Header />
      <Flex w="100%" flex="1" overflow="hidden">
        <Box
          w="30%"
         
          borderRight="1px solid #e2e8f0"
          display="flex"
          flexDirection="column"
        >
          <HStack p={5} display={"flex"} justifyContent={"space-between"}>
            <InputGroup
              border="1px solid #DFE0DC"
              borderRadius={"10px"}
              bg={"#e7ebf6"}
            >
              <Input
                placeholder="Tìm kiếm đoạn chat.."
                _placeholder={{
                  fontWeight: "500",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
                onFocus={() => {
                  setSelectedChat(null);
                }}
              />
              <InputRightElement>
                <FiSearch />
              </InputRightElement>
            </InputGroup>
            <Flex mr={-4} p={4} justifyContent="flex-end" alignItems="center">
              <Menu>
                <MenuButton
                  colorScheme="blue"
                  as={Button}
                  shadow="md"
                  bg={"#2d5be4"}
                  _hover={{
                    bg: "#1a409f ",
                  }}

                  fontSize={"20px"}
                  color={"white"}
                  transition={"0.4s"}
                >
                  <TiPlus />
                </MenuButton>
                <MenuList border="1px solid #DFE0DC" shadow={"md"}>
                  <MenuItem
                    icon={<FaUser />}
                    onClick={() => {
                      setAddState("user");
                      onOpen();
                    }}
                  >
                    Liên hệ người dùng
                  </MenuItem>
                  <MenuItem
                    icon={
                      <Box fontSize={"20px"}>
                        <FaUserFriends />
                      </Box>
                    }
                    onClick={() => {
                      setAddState("group");
                      onOpen();
                    }}
                  >
                    Tạo nhóm mới
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </HStack>

          <VStack
            align="stretch"
            spacing={2}
            overflowY="auto"
            flex="1"
            paddingInline={4}
          >
            {sortedChats.map((boxChat, idx) => (
              <div key={idx}>
                <ChatBox
                  idx={boxChat._id}
                  boxChat={boxChat}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  userDetail={userDetail}
                />
              </div>
            ))}
          </VStack>

          <Flex
            mt={4}
            p={4}
            bg="gray.50"
            borderTop="1px solid #e2e8f0"
            justifyContent="flex-end"
            alignItems="center"
            w="100%"
          />
        </Box>

        <MessageBox
          showInfo={showInfo}
          selectedChat={selectedChat}
          toggleInfoPanel={toggleInfoPanel}
          dispatch={dispatch}
          setShowInfo={setShowInfo}
          onOpen={onOpen}
          setAddState={setAddState}
        />
        {/* {showInfo && <InfoChatModal />} */}
      </Flex>
      <ListUserModal
        isOpen={isOpen}
        onClose={onClose}
        userDetail={userDetail}
        boxChatList={boxChatList}
        dispatch={dispatch}
        socket={socket}
        addState={addState}
        setAddState={setAddState}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
      />
    </VStack>
  );
};

export default ChatPage;
