/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  List,
  ListItem,
  Tooltip,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi";
import { PiChatCenteredDotsBold } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import {
  clearRefBoxChat,
  loadAllMessage,
  loadAllRoom,
  setRefBoxChat,
} from "../../../Redux/slices/chatSlice";
import { reloadData } from "../../../Redux/slices/authSlice";

const ListUser = ({
  users,
  handleAddUser,
  addState,
  userDetail,
  onClose,
  setSelectedChat,
  handleAddMember,
  socket
}) => {
  const dispatch = useDispatch();
  const refBoxChat = useSelector((state) => state.chat.refBoxChat);

  useEffect(() => {
    if (refBoxChat.room_id) {
      setSelectedChat(refBoxChat.room_id);
    //  dispatch(loadAllMessage(`chat/messages/${refBoxChat.room_id}`));
      dispatch(clearRefBoxChat());
    }
  }, [refBoxChat.room_id]);

  return (
    <Box>
      <List spacing={3}>
        {users.map((user) => (
          <ListItem key={user._id}>
            <Flex justifyContent={"space-between"} alignItems="center">
              <Flex alignItems="center">
                <Avatar size="sm" name={user.userName} mr={3} />
                <Text>{user.userName}</Text>
              </Flex>
              {addState === "group" || addState === "addMember" ? (
                <Box cursor="pointer" onClick={() => handleAddUser(user)}>
                  <HiPlus />
                </Box>
              ) : (
                <Box
                  cursor="pointer"
                  fontSize={"18px"}
                  onClick={() => {
                    dispatch(
                      setRefBoxChat({
                        url: "chat/createOrFind/room",
                        data: {
                          userId: userDetail._id,
                          otherUserId: user._id,
                        },
                      })
                    );
                    setTimeout(() => {
                      dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
                      dispatch(reloadData(`accounts/reload/${userDetail._id}`));
                     //  setSelectedChat(refBoxChat.room_id)
                      socket.emit("createGroupChat", {
                        memberIds: [user._id],
                        owner: userDetail._id,
                        type: 'user'
                      })
                     onClose(); 
                    }, 500); 
                     
                  }}
                >
                  <PiChatCenteredDotsBold />
                </Box>
              )}
            </Flex>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ListUser;
