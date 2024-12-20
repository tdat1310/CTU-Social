import {
  Box,
  Wrap,
  Flex,
  Text,
  Image,
  IconButton,
  HStack,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { FaRegFile } from "react-icons/fa";
import { FiImage, FiPaperclip, FiX } from "react-icons/fi";
import { LuSendHorizonal } from "react-icons/lu";
import { BiSolidSend } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { getUnseenMessageCount, loadAllMessage, markAllMessagesAsSeen } from "../../../Redux/slices/chatSlice";
const MsgBoxFooter = ({
  selectedFiles,
  handleRemoveFile,
  handleSendMessage,
  setMsg,
  msg,
  handleFileChange,
  error,
  setError,
  selectedChat,
  userDetail
}) => {
  const dispatch = useDispatch()
  return (
    <>
      {selectedFiles.length > 0 && (
        <Wrap
          p={2}
          borderTop="1px solid #DFE0DC"
          borderBottom="1px solid #DFE0DC"
          bgColor={"#eff4fa"}
          spacing={2}
          overflowX="auto"
          maxWidth="100%"
          whiteSpace="nowrap"
        >
          {selectedFiles.map((file, index) => (
            <Box
              key={index}
              position="relative"
              shadow={"md"}
              p={3}
              bgColor={"#f8f9fd"}
              display="inline-block"
              border="1px solid #DFE0DC"
              borderRadius={'10px'}
            >
              {file.type.startsWith("image/") ? (
                <Image
                  src={URL.createObjectURL(file)}
                  boxSize="60px"
                  objectFit="cover"
                  borderRadius="md"
                  alt={file.name}
                />
              ) : (
                <Flex
                  maxWidth="160px"
                  textOverflow="ellipsis"
                  h={"40px"}
                  gap={"5px"}
                  alignItems={"center"}
                >
                  <Box fontSize={"18px"} mb={"6px"}>
                    <FaRegFile />
                  </Box>
                  <Text fontSize="sm" isTruncated>
                    {file.name}
                  </Text>
                </Flex>
              )}
              <Box
                position="absolute"
                top={"0"}
                right={"0"}
                cursor="pointer"
                onClick={() => handleRemoveFile(index)}
                color="red.500"
                border="1px solid #DFE0DC"
                shadow={'md'}
                bg="white"
                borderRadius="full"
                p={1}
                _hover={{
                  transform: "scale(1.1)",
                }}
              >
                <FiX />
              </Box>
            </Box>
          ))}
        </Wrap>
      )}

      <HStack spacing={4} p={4} borderTop={"1px solid #DFE0DC"} shadow={"md"}>
        <Box flex="1" ml={"10px"}>
          {error && (
            <Text color={"red"} mb={"10px"}>
              Chưa nhập nội dung tin nhắn !!
            </Text>
          )}
          <Input
            placeholder="Nhập tin nhắn..."
            // onFocus={()=>{
            //   dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
              
            // }}
            flex="1"
            id="send"
            fontWeight={500}
            borderRadius={"10px"}
            bg={"#e7ebf6"}
            value={msg}
            border={error ? "1px solid red" : "1px solid #DFE0DC"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            onFocus={() => {
              setError(false);
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
              dispatch(getUnseenMessageCount(`chat/MissMsg/${userDetail._id}`));
            }}
            onChange={(e) => setMsg(e.target.value)}
          />
        </Box>
        <Flex mt={error && "35px"} gap={"10px"}>
          <Tooltip label={"Gửi ảnh"} hasArrow>
            <IconButton
              icon={<FiImage />}
              aria-label="Send Image"
              variant="ghost"
              color={"#2d5be4"}
              onClick={() => {
                document.getElementById("imageInput").click();
                document.getElementById("send").focus();
              }}
            />
          </Tooltip>
          <Input
            type="file"
            accept="image/*"
            id="imageInput"
            style={{ display: "none" }}
            multiple
            onChange={handleFileChange}
          />
          <Tooltip label={"Gửi file"} hasArrow>
            <IconButton
              icon={<FiPaperclip />}
              aria-label="Send File"
              variant="ghost"
              color={"#2d5be4"}
              onClick={() => {
                document.getElementById("fileInput").click();
                document.getElementById("send").focus();
              }}
            />
          </Tooltip>
          <Input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
          />
          <IconButton
            icon={<BiSolidSend />}
            aria-label="Send Message"
            variant="ghost"
            onClick={handleSendMessage}
            border="1px solid #DFE0DC"
            borderRadius={"10px"}
            bg={"#2d5be4"}
            color={"whitesmoke"}
            _hover={{
              bg: "#1a409f",
            }}
            transition={"0.4s"}
          />
        </Flex>
      </HStack>
    </>
  );
};

export default MsgBoxFooter;
