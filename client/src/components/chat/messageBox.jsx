/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import { VStack, Flex, Avatar, Text, Spinner, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { HiUserAdd } from "react-icons/hi";
import {
  clearRefBoxChat,
  getUnseenMessageCount,
  loadAllMessage,
  loadAllRoom,
  markAllMessagesAsSeen,
} from "../../Redux/slices/chatSlice";
import Message from "./message";
import { SocketContext } from "../../provider/socketContext";
import AttachApi from "../../apis/attachApi";
import MsgBoxHeader from "./messageBox/msgBoxHeader";
import MsgBoxFooter from "./messageBox/msgBoxFooter";
import InfoChatModal from "../Modal/infoChatModal";

const MessageBox = ({
  showInfo,
  selectedChat,
  toggleInfoPanel,
  dispatch,
  setShowInfo,
  setAddState,
  onOpen,
}) => {
  const message = useSelector((state) => state.chat.message);
  const boxchat = useSelector((state) => state.chat.boxChat);
  const userDetail = useSelector((state) => state.auth.userDetail);
  const socket = useContext(SocketContext);
  const [msg, setMsg] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const messageRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [hide, setHide] = useState(false);
  // Cuộn xuống cuối khi nhận tin nhắn mới
  //  console.log(message)
  useEffect(() => {
    setTimeout(() => {
      const messageList = document.getElementById("messageList");
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }, 400);
  }, [message]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 950);
    // dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
    if (selectedChat !== null) {
      setMsg("");
      setSelectedFiles([]);
      setSearchQuery("");
      setSearchResults([]);
      setShowInfo(false);
      document.getElementById("send").focus();
      dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
      const handleNewMessage = (data) => {
        console.log('hello')
        dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
        dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
        dispatch(
          markAllMessagesAsSeen({
            url: "chat/setSeenMsg",
            data: {
              userId: userDetail._id,
              roomId: selectedChat,
            },
          })
        );
        // dispatch(getUnseenMessageCount(`chat/MissMsg/${userDetail._id}`));

      };
      socket.on("new_message", handleNewMessage);
      return () => {
        // socket.off("new_message", handleNewMessage);
        clearTimeout(timer);
      };
    }
  }, [selectedChat, dispatch, socket]);

  useEffect(() => {
    if (
      searchResults.length > 0 &&
      messageRefs.current[searchResults[currentResultIndex]]
    ) {
      messageRefs.current[searchResults[currentResultIndex]].scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [currentResultIndex]);

  const handleScroll = () => {
    const container = document.getElementById("messageList");

    if (container) {
      setUserScrolled(
        container.scrollTop <
          container.scrollHeight - container.clientHeight - 10
      );
    }
  };

  const handleSendMessage = async () => {
    if (selectedFiles.length === 0) {
      if (msg === "") {
        setError(true);
        document.getElementById("send").blur();
      } else {
        socket.emit("sendMessage", {
          NguoiGui_id: userDetail._id,
          NhomChat_id: selectedChat,
          NoiDung: msg,
          type: "text",
          groupType:
            boxchat.find((chat) => chat._id == selectedChat).type == "group"
              ? "group"
              : "user",
        });
        setMsg("");
        setSelectedFiles([]);
        setTimeout(() => {
          dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
          dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
          // dispatch(
          //   markAllMessagesAsSeen({
          //     url: "chat/setSeenMsg",
          //     data: {
          //       userId: userDetail._id,
          //       roomId: selectedChat,
          //     },
          //   })
          // );
        }, 500);
      }
      return;
    }

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const otherFiles = selectedFiles.filter(
      (file) => !file.type.startsWith("image/")
    );
    setMsg("");
    setSelectedFiles([]);
    if (imageFiles.length > 0) {
      await AttachApi.createAttach(
        `chat/attachs/${selectedChat}`,
        imageFiles,
        "chat-pic",
        "hello",
        userDetail._id,
        boxchat.find((chat) => chat._id == selectedChat).type == "group"
          ? "group"
          : "user"
      );
    }

    if (otherFiles.length > 0) {
      await AttachApi.createAttach(
        `chat/attachs/${selectedChat}`,
        otherFiles,
        "chat-file",
        "hello",
        userDetail._id,
        boxchat.find((chat) => chat._id == selectedChat).type == "group"
          ? "group"
          : "user"
      );
    }
    socket.emit("sendMessage", {
      NguoiGui_id: userDetail._id,
      NhomChat_id: selectedChat,
      type: "media",
    });
    setTimeout(() => {
      dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
      dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
      // dispatch(
      //   markAllMessagesAsSeen({
      //     url: "chat/setSeenMsg",
      //     data: {
      //       userId: userDetail._id,
      //       roomId: selectedChat,
      //     },
      //   })
      // );
    }, 500);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
    e.target.value = null;
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }

    const results = message
      .map((mess, idx) =>
        !mess.file &&
        mess.NoiDung.toLowerCase().includes(searchQuery.toLowerCase())
          ? idx
          : -1
      )
      .filter((index) => index !== -1);
    setSearchResults(results);
    setCurrentResultIndex(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const goToNextResult = () => {
    if (searchResults.length > 0) {
      setCurrentResultIndex((prevIndex) =>
        prevIndex === searchResults.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const goToPreviousResult = () => {
    if (searchResults.length > 0) {
      setCurrentResultIndex((prevIndex) =>
        prevIndex === 0 ? searchResults.length - 1 : prevIndex - 1
      );
    }
  };
  const chat = boxchat.find((chat) => chat._id == selectedChat);
  return (
    <>
      <Flex
        w={showInfo ? "60%" : "70%"}
        bg="white"
        display="flex"
        flexDirection="column"
        justifyContent={"flex-start"}
        overflow="hidden"
      >
        {selectedChat !== null ? (
          <>
            <MsgBoxHeader
              boxchat={boxchat}
              selectedChat={selectedChat}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSearchResults={setSearchResults}
              setCurrentResultIndex={setCurrentResultIndex}
              handleKeyDown={handleKeyDown}
              searchResults={searchResults}
              currentResultIndex={currentResultIndex}
              goToPreviousResult={goToPreviousResult}
              goToNextResult={goToNextResult}
              toggleInfoPanel={toggleInfoPanel}
              userDetail={userDetail}
              dispatch={dispatch}
              socket={socket}
              onOpen={onOpen}
              setAddState={setAddState}
            />
            {loading && (
              <Flex position="fixed" top="50%" left="63%">
                <Spinner
                  size="xl"
                  emptyColor="gray.200"
                  thickness="5px"
                  speed="0.65s"
                  color="blue.500"
                />
              </Flex>
            )}
            <VStack
              align="stretch"
              spacing={4}
              overflowY="auto"
              flex="1"
              paddingInline={4}
              paddingBottom={4}
              id="messageList" // Thêm id ở đây
              onScroll={handleScroll}
              visibility={loading ? "hidden" : "visible"}
            >
              {/* Thêm avatar và tên ở đây */}
              <VStack spacing={4} padding={4}>
                <Avatar
                  src={
                    chat?.otherUser?.avtPic
                      ? chat.otherUser.avtPic?.display_url
                      : "/src/assets/no-avt.png"
                  }
                />
                <Text fontWeight="bold">
                  {(() => {
                    const chat = boxchat.find(
                      (chat) => chat._id == selectedChat
                    );
                    return chat?.type === "user"
                      ? chat?.otherUser?.userName
                      : chat?.groupChatName;
                  })()}
                </Text>
              </VStack>

              {/* Render danh sách tin nhắn */}
              {message?.map((mess, idx) => (
                <VStack
                  key={idx}
                  ref={(prev) => (messageRefs.current[idx] = prev)}
                >
                  <Message
                    mess={mess}
                    prevMess={idx !== 0 && message[idx - 1]}
                    nextMess={idx + 1 < message.length && message[idx + 1]} // Sửa chỗ này để tránh lỗi
                    user_id={userDetail._id}
                    userSend={boxchat.find(
                      (chat) =>
                        chat._id === selectedChat && chat.type === "group"
                    )}
                    idx={idx}
                    searchResultIndex={searchResults[currentResultIndex]}
                    searchResults={searchQuery}
                    selectedChat={selectedChat}
                    dispatch={dispatch}
                    userDetail={userDetail}
                  />
                </VStack>
              ))}
            </VStack>

            <MsgBoxFooter
              selectedFiles={selectedFiles}
              selectedChat={selectedChat}
              handleRemoveFile={handleRemoveFile}
              handleSendMessage={handleSendMessage}
              setMsg={setMsg}
              msg={msg}
              userDetail={userDetail}
              handleFileChange={handleFileChange}
              error={error}
              setError={setError}
            />
          </>
        ) : (
          <Flex
            flex="1"
            align="center"
            justify="center"
            flexDirection={"column"}
          >
            <Text fontWeight={"600"} fontSize={"20px"}>
              Chọn đoạn chat để bắt đầu trò chuyện
            </Text>
            <Image h={"400px"} src="/src/assets/no-msg.png" />
          </Flex>
        )}
      </Flex>
      {showInfo && (
        <InfoChatModal
          memberSection={boxchat.filter(
            (chat) => chat._id == selectedChat && chat.type == "group"
          )}
          userDetail={userDetail}
        />
      )}
    </>
  );
};

export default MessageBox;
