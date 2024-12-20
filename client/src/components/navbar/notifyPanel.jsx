/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { BiBell } from "react-icons/bi";
import BagdeCustom from "../common/bagde";
import NotiItem from "./notiItem";
import {
  notifyClear,
  notifyReload,
  notifySetStatus,
} from "../../Redux/slices/notifySlice";
import { SocketContext } from "../../provider/socketContext";
import { useSelector } from "react-redux";
import { reloadData } from "../../Redux/slices/authSlice";
const NotifyPanel = ({ setNotifyState, dispatch, user_id }) => {
  let notifyList = useSelector((state) => state.notify.notifyList) || [];
  let userDetail = useSelector((state) => state.auth.userDetail);
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on("notify_response", (data) => {
      dispatch(notifyReload(`notify/${user_id}`));
      dispatch(reloadData(`accounts/reload/${userDetail._id}`));
      
    });
  }, [socket, dispatch]);
  const sortedNotify = [...notifyList].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  return (
    <>
      <Menu placement="bottom-end" closeOnSelect={false}>
        <Box
          position={"relative"}
          onClick={() => {
            if (notifyList.length > 0) {
              dispatch(notifySetStatus(`notify/seen/${userDetail._id}`));
            }
          }}
        >
          {/* <MenuButton
           colorScheme="blue"
            as={Button}
            rounded="full"
            fontSize={"20px"}
            color={"white"}
            shadow={"md"}
            // colorScheme="blue"
            // bg={"#2d5be4"}
            _hover={{
              bg: "#1e46c1",
            }}
            border="3px solid #e3f1ff"
            variant={"ghost"}
         
            aria-label={"Thông báo"}
          >
            <BiBell />
          </MenuButton> */}
          <MenuButton
            colorScheme="blue"
            as={Button}
            bg={"#2d5be4"}
            fontSize={"28px"}
            color={"#d2eef5"}
            _hover={{
              bg: 'none',
              // transform: 'scale(1.1)'
            }}
         

            transition={"0.4s"}
            p={2}
            borderRadius={"35px"}
          >
            <BiBell />
          </MenuButton>
          <BagdeCustom
            Num={
              notifyList.filter((notification) => notification.seen === false)
                .length
            }
            top={-2}
            right={-0.5}
          />
        </Box>
        <MenuList
          border="1px solid #DFE0DC"
          w={"380px"}
          h={"380px"}
          maxH={"380px"}
          color={"black"}
          py={"0"}
          position={"relative"}
        >
          <Box
            p={"10px"}
            fontWeight={"600"}
            fontSize={"20px"}
            position={"sticky"}
            top={"0"}
            translateY={"100px"}
            borderBottom={"1px solid #DFE0DC"}
            bg={"white"}
            zIndex={1}
            h={"15%"}
          >
            Thông báo
          </Box>
          <VStack
            maxH={"75%"}
            h={"75%"}
            spacing={"1px"}
            position={"relative"}
            overflowY={"auto"}
          >
            {sortedNotify.map((notify, index) => (
              <NotiItem
                key={index}
                notify={notify}
                dispatch={dispatch}
                user_id={user_id}
              />
            ))}
          </VStack>
          <Box
            h={"10%"}
            border={"1px solid #DFE0DC"}
            display={"flex"}
            w={"100%"}
            justifyContent={"right"}
            px={"20px"}
          >
            <Button
              variant={"link"}
              alignItems={"center"}
              _hover={{
                textDecoration: "none",
              }}
              onClick={() => {
                dispatch(notifyClear(`notify/clearAll/${user_id}`));
              }}
            >
              Xóa thông báo
            </Button>
          </Box>
        </MenuList>
      </Menu>
    </>
  );
};

export default NotifyPanel;
