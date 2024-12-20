import React from "react";
import { MenuItem, Text, Box, Flex, Link } from "@chakra-ui/react";
import NotifyApi from "../../apis/notifyApi";
import GroupApi from "../../apis/groupApi";
import { notifyReload } from "../../Redux/slices/notifySlice";
import { useSelector } from "react-redux";
import {
  blogDetailClear,
  reloadDetailBlog,
} from "../../Redux/slices/blogSlice";
import { useNavigate } from "react-router-dom";
const NotiItem = ({ notify, dispatch, user_id }) => {
  const handleJoinGroup = async () => {
    try {
      await NotifyApi.clearAllNotify(`notify/clear/${notify._id}`);
      await GroupApi.joinGroup(`groups/join/group`, {
        groupId: notify.fromGroup,
        userId: user_id,
      });
      setTimeout(() => {
        dispatch(notifyReload(`notify/${user_id}`));
      }, 500);
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };
  const userDetail = useSelector((state) => state.auth.userDetail);
  const navigate = useNavigate();
  const renderInviteAction = () => (
    <Box
      border="1px solid #eeeeee"
      shadow="md"
      w="30%"
      fontWeight="500"
      borderRadius="10px"
      _hover={{ bgColor: "#ffffff" }}
      transition="0.2s"
      textAlign="center"
      padding="10px"
      onClick={handleJoinGroup}
    >
      Tham gia
    </Box>
  );

  return (
    <MenuItem
      h="70px"
      w="370px"
      fontSize="16px"
      borderBottom="1px solid #DFE0DC"
      onClick={() => {
        if (notify.NoiDung.type == "post") {
          dispatch(blogDetailClear());
          dispatch(reloadDetailBlog(`posts/reload/${notify.fromPost._id}`));

          setTimeout(() => {
            userDetail._id === notify.fromPost.TaiKhoan_id
              ? navigate(`/account/user/post/${notify.fromPost._id}`)
              : navigate(
                  `/account/guest/${notify.fromPost.TaiKhoan_id}/post/${notify.fromPost._id}`
                );
          }, 500);
        }
        if (notify.NoiDung.type == "follow") {
          navigate(`/account/guest/${notify.fromUser}`);
        }
        if(notify.NoiDung.type == "request") {
          navigate(`/group/${notify.fromGroup}`)
        }
      }}
    >
      <Flex w="100%" justifyContent="space-between">
        <Box w={notify.NoiDung.type === "invite" ? "70%" : "100%"}>
          <Text fontWeight="600" display="inline">
            {notify.NoiDung.userName}
          </Text>{" "}
          {notify.NoiDung.info}
        </Box>
        {notify.NoiDung.type === "invite" && renderInviteAction()}
      </Flex>
    </MenuItem>
  );
};

export default NotiItem;
