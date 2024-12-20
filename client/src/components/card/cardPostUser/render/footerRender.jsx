import React, { useContext, useEffect, useState } from "react";
import {
  Flex,
  Text,
  CardFooter,
  HStack,
  VStack,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Avatar,
} from "@chakra-ui/react";
import { IoBookmarks } from "react-icons/io5";
import { IoMdThumbsUp, IoMdChatboxes } from "react-icons/io";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../../../provider/socketContext";
import { useDispatch } from "react-redux";
import BlogApi from "../../../../apis/blogApi";
import {
  loadAllBlog,
  reloadDetailBlog,
} from "../../../../Redux/slices/blogSlice";
import { reloadData } from "../../../../Redux/slices/authSlice";
import { fetchGlobalData } from "../../../../Redux/slices/globalSlice";
import { getAllPostByTagId } from "../../../../Redux/slices/tagSlice";
import {
  fetchAllPosttTypeGroup,
  fetchGroupDetails,
} from "../../../../Redux/slices/groupSlice";
const FooterRender = ({
  comment,
  inputFocusRef,
  post_id,
  userLikeList,
  userSaveList,
  userInteract,
  userDetail,
  detail,
  dispatch,
  setReload,
  ownerPost,
  feed,
  blogData,
  tag,
  tagPost,
  group,
  groupAll,
}) => {
  const initialLikeColor = userLikeList.some(
    (user) => user._id === userInteract._id
  )
    ? "#2d5be4"
    : "black";
  const initialSaveColor = userSaveList.some(
    (user) => user._id === userInteract._id
  )
    ? "#2d5be4"
    : "black";

  const [colors, setColors] = useState({
    1: initialLikeColor,
    2: "black",
    3: initialSaveColor,
  });

  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI hook to control modal
  const { user_id, role, tag_id, group_id } = useParams();
  const socket = useContext(SocketContext);

  useEffect(() => {
    //  console.log(userLikeList, userSaveList);
    const updatedLikeColor = userLikeList.some(
      (user) => user._id === userInteract._id
    )
      ? "#2d5be4"
      : "black";
    const updatedSaveColor = userSaveList.some(
      (user) => user._id === userInteract._id
    )
      ? "#2d5be4"
      : "black";

    setColors((prevColors) => ({
      ...prevColors,
      1: updatedLikeColor,
      3: updatedSaveColor,
    }));
  }, [userLikeList, userSaveList, userInteract._id]);

  const handleFocus = () => {
    inputFocusRef.current.focus();
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num;
  };

  const toggleLikeColor = (id) => {
    setColors((prevColors) => ({
      ...prevColors,
      [id]: prevColors[id] === "black" ? "#2d5be4" : "black",
    }));
  };

  const likeHandle = async () => {
    if (colors[1] === "black") {
      socket.emit("likeBlog", {
        owner: ownerPost,
        postId: post_id,
        likeBy: userInteract._id,
      });
    } else {
      await BlogApi.removeUserInteract(
        `posts/like/remove/${post_id}/${userInteract._id}`
      );
    }
    setTimeout(() => {
      dispatch(loadAllBlog(`accounts/${userDetail._id}?post=${tagPost}`));
      dispatch(reloadData(`accounts/reload/${userInteract?._id}`));
      if (detail) dispatch(reloadDetailBlog(`posts/reload/${post_id}`));
      if (feed) dispatch(fetchGlobalData(`infos/globalData?post=${tagPost}`));
      if (tag)
        dispatch(
          getAllPostByTagId(`posts/postByTag/${tag_id}?post=${tagPost}`)
        );
      if (group)
        dispatch(
          fetchGroupDetails(
            `groups/get/group/detail/${group_id}?post=${tagPost}`
          )
        );
      if (groupAll)
        dispatch(
          fetchAllPosttTypeGroup(
            `groups/get/postTypeGroup/${userDetail._id}?post=${tagPost}`
          )
        );
      if (role === "guest") setReload((prev) => !prev);
    }, 90);
  };

  const saveHandle = async () => {
    if (colors[3] === "black") {
      socket.emit("saveBlog", {
        owner: ownerPost,
        postId: post_id,
        saveBy: userInteract._id,
      });
    } else {
      await BlogApi.removeUserInteract(
        `posts/save/remove/${post_id}/${userInteract._id}`
      );
    }
    setTimeout(() => {
      dispatch(loadAllBlog(`accounts/${userDetail._id}?post=${tagPost}`));
      dispatch(reloadData(`accounts/reload/${userInteract?._id}`));
      if (detail) dispatch(reloadDetailBlog(`posts/reload/${post_id}`));
      if (feed) dispatch(fetchGlobalData(`infos/globalData?post=${tagPost}`));
      if (tag)
        dispatch(
          getAllPostByTagId(`posts/postByTag/${tag_id}?post=${tagPost}`)
        );
      if (group)
        dispatch(
          fetchGroupDetails(
            `groups/get/group/detail/${group_id}?post=${tagPost}`
          )
        );
      if (groupAll)
        dispatch(
          fetchAllPosttTypeGroup(
            `groups/get/postTypeGroup/${userDetail._id}?post=${tagPost}`
          )
        );
      if (role === "guest") setReload((prev) => !prev);
    }, 200);
  };

  // Dữ liệu cho các icon và thông tin liên quan
  const iconData = [
    { id: 1, icon: IoMdThumbsUp, count: userLikeList.length, label: "Likes" },
    { id: 2, icon: IoMdChatboxes, count: comment, label: "Comments" },
    { id: 3, icon: IoBookmarks, count: userSaveList.length, label: "Saves" },
  ];

  const [firstUser, ...otherUsers] = userLikeList;
  return (
    <CardFooter justify="space-between" flexWrap="wrap" pt={"15px"}>
      <Flex flexDirection={"column"} w="100%" gap={"10px"}>
        <Box
          cursor="pointer"
          onClick={onOpen}
          ml={"15px"}
          h={"24px"}
          fontWeight={"500"}
        >
          {firstUser && (
            <Flex gap={"5px"} color={"#2d5be4"}>
              <Box fontSize={"19px"} mt={"2px"}>
                <IoMdThumbsUp />
              </Box>
              <Text>
                {firstUser.userName}
                {userLikeList.length > 1 &&
                  " và " + otherUsers.length + " người khác"}
              </Text>
            </Flex>
          )}
        </Box>
        <Flex alignItems="center" justifyContent="space-evenly" w="100%">
          {iconData.map(({ id, icon: Icon, count, label }) => (
            <HStack
              key={id}
              onClick={() => {
                if (label === "Likes") {
                  toggleLikeColor(id);
                  likeHandle();
                }
                if (label === "Saves") {
                  toggleLikeColor(id);
                  saveHandle();
                }
                if (label === "Comments") {
                  handleFocus();
                }
              }}
              cursor="pointer"
              p={"10px 30px"}
              border={"1px solid #DFE0DC"}
              borderRadius={"10px"}
              color={label === "Comments" ? "" : colors[id] || "black"}
            >
              <Icon
                className="icon"
                fontSize="19px"
                color={label === "Comments" ? "" : colors[id] || "black"}
              />
              <Text ml={1} fontWeight={500}>
                {count > 0 ? `${formatNumber(count)} ${label}` : label}
              </Text>
            </HStack>
          ))}
        </Flex>
      </Flex>

      {/* Modal to show user list */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Người thích</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {userLikeList.length > 0 ? (
              <Flex
                flexDirection={"column"}
                gap={"10px"}
                h={'400px'} maxH={'400px'} overflow={'auto'}
              >
                {userLikeList.map((user) => (
                  <Flex key={user._id} gap={"10px"}>
                    <Avatar
                      size={"sm"}
                      src={
                        user.avtPic
                          ? user.avtPic.display_url
                          : "/src/assets/no-avt.png"
                      }
                    />
                    <Text mt={"5px"}>{user.userName}</Text>
                  </Flex>
                ))}
              </Flex>
            ) : (
              <Text>Chưa có ai thích bài viết này.</Text>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </CardFooter>
  );
};

export default FooterRender;
