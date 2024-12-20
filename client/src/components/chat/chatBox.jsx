/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, memo } from "react";
import {
  Flex,
  HStack,
  Avatar,
  Text,
  Box,
  AvatarBadge,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { SocketContext } from "../../provider/socketContext";
import DateFormat from "../../utils/dateFormat";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  getUnseenMessageCount,
  loadAllMessage,
  loadAllRoom,
  markAllMessagesAsSeen,
} from "../../Redux/slices/chatSlice";
import { HiDotsVertical } from "react-icons/hi"; // Import icon 3 chấm
import { ChatApi } from "../../apis/chatApi";
import { reloadData } from "../../Redux/slices/authSlice";

const ChatBox = ({
  idx,
  selectedChat,
  setSelectedChat,
  boxChat,
  userDetail,
}) => {
  const unReadMsgList = useSelector((state) => state.chat.boxChatCount);
  const [unReadMsg, setUnReadMessage] = useState(0);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const [onlineState, setOnlineState] = useState(false);
  // State để điều khiển mở/đóng AlertDialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onCloseAlert = () => setIsAlertOpen(false);
  const cancelRef = React.useRef();

  const handleDeleteChat = async () => {
    const idList =
      boxChat.type === "group"
        ? boxChat?.otherUser.map((user) => user._id)
        : [boxChat.otherUser._id];
    await ChatApi.deleteBoxchat("chat/deleteGroupChat", {
      roomId: boxChat._id,
    });
    socket.emit("deteleBoxChat", {
      memberIds: idList,
    });

    setTimeout(() => {
      dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
      dispatch(reloadData(`accounts/reload/${userDetail._id}`));
      setSelectedChat(null);
      setIsAlertOpen(false); // Đóng hộp thoại sau khi xóa
    }, 500);
  };

  useEffect(() => {
    // setSelectedChat(idx)
    if (selectedChat !== idx) {
      dispatch(getUnseenMessageCount(`chat/MissMsg/${userDetail._id}`));
      socket.on("new_message", (data) => {
        dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`))
        // console.log(selectedChat)
        dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
        dispatch(getUnseenMessageCount(`chat/MissMsg/${userDetail._id}`));
      });
    } else {
      socket.on("new_message", (data) => {
        // dispatch(getUnseenMessageCount(`chat/MissMsg/${userDetail._id}`));
       
      //  console.log('hello')
        dispatch(
          markAllMessagesAsSeen({
            url: "chat/setSeenMsg",
            data: {
              userId: userDetail._id,
              roomId: selectedChat,
            },
          })
        );
        dispatch(getUnseenMessageCount(`chat/MissMsg/${userDetail._id}`));
      });
    }

    if (boxChat.type === "user") {
      socket.on("onlineUser", (data) => {
        if (boxChat.otherUser._id === data.userId) {
          setOnlineState(data.online);
        }
      });
      socket.emit("findOnlineUser", {
        userId: boxChat.otherUser._id,
        userEmit: userDetail._id,
      });
    } else {
      setOnlineState(false);
    }

    return () => {
      socket.off("new_message");
      socket.off("onlineUser");
    };
  }, [selectedChat, boxChat.otherUser._id]);

  const renderLatestMessage = () => {
    if (boxChat.latestMsg) {
      if (boxChat.latestMsg.file) {
        if (boxChat.latestMsg.file.type === "chat-pic") {
          return "Đã gửi 1 ảnh";
        } else if (boxChat.latestMsg.file.type === "chat-file") {
          return "Đã gửi 1 file";
        } else {
          return "Đã gửi 1 tệp";
        }
      } else if (boxChat.latestMsg.NoiDung) {
        return boxChat.latestMsg.NoiDung;
      }
    }
    return "Chưa có tin nhắn";
  };

  const unreadCount = unReadMsgList?.find((item) => item.id === idx)?.count;

  return (
    <>
      <HStack
        p={4}
        borderLeft={`10px ${
          selectedChat === idx ? "#2d5be4" : "transparent"
        } solid`}
        spacing={3}
        bg={selectedChat === idx ? "#e7ebf6" : ""}
        _hover={{
          bg: selectedChat !== idx && "#e7ebf6",
          transition: "0.3s",
          borderLeftColor: "#2d5be4",
        }}
        // display={
        //   boxChat.type === "user" && !boxChat.latestMsg && selectedChat !== idx
        //     ? "none"
        //     : "flex"
        // }
        borderRadius="md"
        // shadow={"md"}
        cursor="pointer"
        position={"relative"}
        onClick={() => {
          // await handleDeleteChat();
          // dispatch(
          //   markAllMessagesAsSeen({
          //     url: "chat/setSeenMsg",
          //     data: {
          //       userId: userDetail._id,
          //       roomId: idx,
          //     },
          //   })
          // );

          
          dispatch(
            markAllMessagesAsSeen({
              url: "chat/setSeenMsg",
              data: {
                userId: userDetail._id,
                roomId: idx,
              },
            })
          );
          setTimeout(() => {
            setSelectedChat(idx);
           // dispatch(loadAllMessage(`chat/messages/${idx}`));
            dispatch(getUnseenMessageCount(`chat/MissMsg/${userDetail._id}`));
          }, 1000);
          //  dispatch(getUnseenMessageCount(`chat/MissMsg/${userDetail._id}`));
        }}
      >
        <Avatar
          name={`User ${idx + 1}`}
          src={
            boxChat.otherUser.avtPic
              ? boxChat.otherUser.avtPic.display_url
              : "/src/assets/no-avt.png"
          }
        >
          {onlineState && <AvatarBadge boxSize="1.25em" bg="#6EC207" />}
        </Avatar>
        <Flex flex="1" direction="column" gap="10px">
          <Flex justifyContent={"space-between"}>
            <Text fontWeight="bold" fontSize={"19px"}>
              {boxChat.type === "user"
                ? boxChat.otherUser?.userName
                : boxChat.groupChatName}
            </Text>
            <Menu p={0} minW="0" placement={"bottom-end"}>
              <MenuButton>
                <Icon as={HiDotsVertical} boxSize={4} color="gray.500" />
              </MenuButton>
              <MenuList
                w={"150px"}
                minW="0"
                position={"absolute"}
                top={"-10px"}
                right={"-5px"}
                shadow={"md"}
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "-6px", // Vị trí phía trên menu
                  right: "5px", // Điều chỉnh theo vị trí của icon
                  borderLeft: "8px solid transparent", // Cạnh trái tam giác
                  borderRight: "8px solid transparent", // Cạnh phải tam giác
                  borderBottom: "8px solid white", // Màu tam giác (phù hợp với màu nền của menu)
                }}
              >
                <MenuItem
                  fontSize={"15px"}
                  w={"150px"}
                  minW="0"
                  display={"flex"}
                  gap={"7px"}
                  onClick={() => setIsAlertOpen(true)} // Mở hộp thoại xác nhận xóa
                >
                  <Box fontSize={"18px"} mb={"2px"}>
                    <RiDeleteBin5Line />
                  </Box>
                  <Text>Xóa đoạn chat</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex justifyContent="space-between" alignItems={"center"}>
            <Text
              fontSize="sm"
              color="gray.600"
              isTruncated
              textOverflow="ellipsis"
              maxW="200px"
            >
              {renderLatestMessage()}
            </Text>
            <Flex alignItems={"center"} gap={"10px"}>
              {unreadCount > 0 && (
                <Box
                  h={"21px"}
                  w={"21px"}
                  bgColor={"red"}
                  textAlign={"center"}
                  borderRadius={"100px"}
                  color={"white"}
                  fontWeight={"600"}
                  fontSize={"14px"}
                >
                  {unreadCount}
                </Box>
              )}

              <Text
                fontSize="xs"
                color="gray.500"
                minW="60px"
                textAlign="right"
              >
                {DateFormat(boxChat?.latestMsg?.createdAt)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </HStack>

      {/* AlertDialog để xác nhận xóa */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa đoạn chat
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa đoạn chat này? Hành động này không thể
              hoàn tác.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAlert}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDeleteChat} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default memo(ChatBox);
