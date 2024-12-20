/* eslint-disable react-hooks/exhaustive-deps */
import { Box, IconButton } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import BagdeCustom from "../common/bagde";
import { BiMessageDetail } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../provider/socketContext";
import { useDispatch, useSelector } from "react-redux";
import {
  getUnseenMessageCount,
  loadAllRoom,
} from "../../Redux/slices/chatSlice";

const MessagePanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const unReadMsgList = useSelector((state) => state.chat.boxChatCount);

  const boxChatList = useSelector((state) => state.chat.boxChat);

  const userDetail = useSelector((state) => state.auth.userDetail);
  useEffect(() => {
    socket.on("notify_message", (data) => {
      dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
     dispatch(getUnseenMessageCount(`chat/MissMsg/${userDetail._id}`));
      if(boxChatList.length != []) {
        boxChatList.forEach((boxChat) => {
          socket.emit("join_room", { room_id: boxChat._id });
        });
      }
    });
  }, [dispatch, socket]);
  return (
    <Box position={"relative"}>
      <IconButton
        icon={<BiMessageDetail />}
        borderRadius={'20px'}
        fontSize={'28px'}
        color={"#d2eef5"}
        _hover={{
          bg: 'none',
          transform: 'scale(1.1)'
        }}
     
        transition={'0.4s'}
        p={2}
        // border="3px solid #e3f1ff"
        variant={'ghost'}
        onClick={() => {
          navigate("/chat");
        }}
        // shadow={'md'}
      />
      <BagdeCustom
        Num={unReadMsgList?.reduce((total, item) => total + item.count, 0)}
        top={-2}
        right={-1}
      />
    </Box>
  );
};

export default MessagePanel;
