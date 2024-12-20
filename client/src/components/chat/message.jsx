import { useEffect, useState, memo } from "react";
import {
  Box,
  Image,
  Text,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import GetIconByMimeType from "../../utils/GetIconByMimeType";
import { MdOutlineFileDownload } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { ChatApi } from "../../apis/chatApi";
import { loadAllMessage, loadAllRoom } from "../../Redux/slices/chatSlice";

// Custom Tooltip Component
const CustomTooltip = ({ children, tooltipText, isSender, type }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Box
      position="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <Box
          position="absolute"
          top={type == "chat-pic" ? "40%" : "-50%"}
          right={isSender ? "120%" : "none"}
          left={isSender ? "none" : "120%"}
          transform={isSender ? "translateX(-25px)" : "translateX(25px)"}
          mt="4px"
          p="6px"
          bg="gray.700"
          color="white"
          borderRadius="md"
          whiteSpace="nowrap"
          fontSize="sm"
          zIndex="1"
          width="max-content"
        >
          {tooltipText}
        </Box>
      )}
    </Box>
  );
};

const Message = ({
  mess,
  user_id,
  idx,
  searchResultIndex,
  searchResults,
  prevMess,
  userSend,
  nextMess,
  selectedChat,
  dispatch,
  userDetail,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [hide, setHide] = useState(false);
  const isSender = mess.NguoiGui_id?._id === user_id;

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    onOpen();
  };

  const splitAndHighlight = (content, searchTerm) => {
    if (!searchTerm || typeof searchTerm !== "string") return [content];

    const parts = content.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <Text as="mark" key={index} bg="yellow.200">
          {part}
        </Text>
      ) : (
        part
      )
    );
  };

  // Format the createdAt date
  const formattedDate = new Date(mess.createdAt).toLocaleString();
  const deleteMessage = async () => {
    await ChatApi.deleteSingeMessage("chat/deleteSingleMsg", {
      messageId: mess._id,
      roomId: selectedChat,
    });
    setTimeout(() => {
      dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
      dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
    }, 500);
  };
  return (
    <VStack
      w={"100%"}
      onMouseEnter={() => {
        isSender && setHide(true);
      }}
      onMouseLeave={() => {
        isSender && setHide(false);
      }}
    >
      <Flex alignSelf={isSender ? "flex-end" : "flex-start"} gap={"10px"}>
        {!isSender &&
          (mess.NguoiGui_id?._id !== nextMess?.NguoiGui_id?._id ? (
            <Avatar
              size={"sm"}
              alignSelf={"center"}
              mt={"20px"}
              src={mess.NguoiGui_id?.avtPic?.display_url}
            />
          ) : (
            <Box w={"30px"}></Box>
          ))}
        <Flex flexDirection={"column"}>
          {!isSender &&
            userSend?.type == "group" &&
            (mess.NguoiGui_id?._id !== prevMess?.NguoiGui_id?._id ? (
              <Text color={"#718097"} fontSize={"15px"} mb={"5px"}>
                {
                  userSend.otherUser.find(
                    (user) => user._id === mess.NguoiGui_id?._id
                  )?.userName
                }
              </Text>
            ) : (
              ""
            ))}

          <Flex gap={"20px"} alignItems={"center"}>
            {isSender && hide && (
              <Box position={"relative"}>
                <Menu placement={"left-end"}>
                  <MenuButton fontSize={"20px"}>
                    <BsThreeDots />
                  </MenuButton>
                  <MenuList
                    border="1px solid #DFE0DC"
                    position={"absolute"}
                    right={0}
                    bottom={-3}
                    shadow={"md"}
                  >
                    <MenuItem onClick={deleteMessage}>Xóa tin nhắn</MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            )}
            <Box
              p={4}
              bg={isSender ? "#2d5be4" : "gray.100"}
              // borderRadius="15px"
              borderBottomRadius={"15px"}
              borderTopLeftRadius={isSender ? "15px" : ""}
              borderTopRightRadius={!isSender ? "15px" : ""}
              color={isSender ? "whitesmoke" : "black"}
              border={idx === searchResultIndex ? "2px solid yellow" : "none"}
              position="relative"
              shadow={"md"}
              cursor={"pointer"}
            >
              <CustomTooltip
                tooltipText={formattedDate}
                isSender={isSender}
                type={mess?.file?.type}
              >
                {mess.file ? (
                  <>
                    {mess.file.type === "chat-pic" ? (
                      <Image
                        src={mess.file.display_url}
                        alt="Chat image"
                        maxW="200px"
                        cursor="pointer"
                        onClick={() => handleImageClick(mess.file.display_url)}
                      />
                    ) : (
                      <Flex gap="10px" alignItems={"center"}>
                        <Box fontSize="20px">
                          <GetIconByMimeType mimeType={mess.file.mimeType} />
                        </Box>
                        <Text>{mess.file.name_file}</Text>
                        <Link fontSize="22px" href={mess.file.download_url}>
                          <MdOutlineFileDownload />
                        </Link>
                      </Flex>
                    )}
                  </>
                ) : (
                  <Text>
                    {idx === searchResultIndex
                      ? splitAndHighlight(mess.NoiDung, searchResults)
                      : mess.NoiDung}
                  </Text>
                )}
              </CustomTooltip>
            </Box>
          </Flex>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose} isCentered position="relative">
          <ModalOverlay />
          <ModalContent>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Full-sized chat image"
                objectFit="contain"
              />
            )}
          </ModalContent>
        </Modal>
      </Flex>
    </VStack>
  );
};

export default memo(Message);
