import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  CardHeader,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  AvatarGroup,
} from "@chakra-ui/react";
import { BsExclamationTriangle, BsThreeDotsVertical } from "react-icons/bs";
import { BsPencil, BsTrash } from "react-icons/bs";
import BlogApi from "../../../../apis/blogApi";
import { useDispatch, useSelector } from "react-redux";
import { reloadData } from "../../../../Redux/slices/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { loadAllBlog } from "../../../../Redux/slices/blogSlice";
import DateFormat from "../../../../utils/dateFormat";
import { fetchGlobalData } from "../../../../Redux/slices/globalSlice";
import { getAllPostByTagId } from "../../../../Redux/slices/tagSlice";
import {
  fetchAllPosttTypeGroup,
  fetchGroupDetails,
} from "../../../../Redux/slices/groupSlice";
import { AdminApi } from "../../../../apis/adminApi";

const HeaderRender = ({
  userDetail,
  post_id,
  handleCreatePostClick,
  blogData,
  ownerPost,
  feed,
  tag,
  tagPost,
  group,
  groupAll,
  userInteract,
}) => {
  console.log(blogData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role, tag_id, group_id } = useParams();
  const userAcc = useSelector((state) => state.auth.userDetail);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reportReason, setReportReason] = useState("");
  const deleteHandle = async () => {
    try {
      const data = {
        user_id: ownerPost,
        tag_ids: blogData.Tags.map((item) => item._id),
        drive_ids: blogData.imageList
          .map((item) => item.drive_id)
          .concat(blogData.fileList.map((item) => item.drive_id)),
        attach_ids: blogData.imageList
          .map((item) => item._id)
          .concat(blogData.fileList.map((item) => item._id)),
      };

      await BlogApi.deleteBlog(`posts/${post_id}`, data);
      dispatch(reloadData(`accounts/reload/${userDetail._id}`));
      dispatch(loadAllBlog(`accounts/${userDetail._id}?post=${tagPost}`));
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
      // if(role==='user')
    } catch (error) {
      console.log(error);
    }
  };
  const handleReportSubmit = async () => {
    await AdminApi.createReport("report/create/Report", {
      Reporter: userAcc._id,
      BaiViet_id: post_id,
      NoiDung: reportReason,
      ownerPost: userDetail._id,
    });
    // Handle report submission logic here (e.g., sending data to the server)
    onClose();
  };
  return (
    <CardHeader>
      <Flex spacing="4">
        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
          <AvatarGroup stacking="last-on-top">
            {blogData.fromGroup && !group_id && (
              <Avatar
                src={
                  blogData?.fromGroup?.coverPic
                    ? blogData.fromGroup.coverPic.display_url
                    : "/src/assets/no-avt.png"
                }
                borderRadius={"10px"}
              />
            )}

            <Avatar
              name="Segun Adebayo"
              size={blogData.fromGroup && !group_id ? "sm" : "md"}
              zIndex={2}
              mt={blogData.fromGroup && !group_id ? "19px" : ""}
              ml={blogData.fromGroup && !group_id ? "-10px" : ""}
              src={
                userDetail.avtPic
                  ? userDetail.avtPic.display_url
                  : "/src/assets/no-avt.png"
              }
              border="3px solid #2d5be4"
            />
          </AvatarGroup>
          <Flex flexDirection={"column"}>
            {blogData.fromGroup && !group_id && (
              <Box
                fontWeight={"700"}
                fontSize={"17px"}
                onClick={() => {
                  navigate(`/group/${blogData.fromGroup._id}`);
                }}
                cursor={"pointer"}
              >
                {blogData.fromGroup.TenNhom}
              </Box>
            )}
            <Text
              size={blogData.fromGroup && !group_id ? "16px" : "20px"}
              fontWeight={blogData.fromGroup && !group_id ? "500" : "700"}
              cursor={"pointer"}
              onClick={() => {
                if (userInteract._id === ownerPost) {
                  navigate("/account/user");
                } else {
                  navigate(`/account/guest/${ownerPost}`);
                }
              }}
            >
              {userDetail.userName}
            </Text>
            <Text
              fontSize={blogData.fromGroup && !group_id ? "12px" : "15px"}
              color={"gray.500"}
            >
              {DateFormat(blogData.createTime)}
            </Text>
          </Flex>
        </Flex>
        <Menu>
          <MenuButton
            as={IconButton}
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={<BsThreeDotsVertical />}
          />
          <MenuList border={"1px solid #DFE0DC"} position={"relative"}>
            {/* <Box
              position="absolute"
              top="-10px" // Điều chỉnh vị trí hình tam giác
              left="11px" // Điều chỉnh vị trí hình tam giác
              width="0"
              height="0"
              borderLeft="11px solid transparent"
              borderRight="11px solid transparent"
              borderBottom="11px solid #DFE0DC" // Màu sắc của tam giác
            >
              <Box
                position="absolute"
                top="1px" // Điều chỉnh vị trí hình tam giác nhỏ
                left="-10px" // Điều chỉnh vị trí hình tam giác nhỏ
                width="0"
                height="0"
                borderLeft="11px solid transparent"
                borderRight="11px solid transparent"
                borderBottom="11px solid white"
              ></Box>
            </Box> */}
            {ownerPost === userAcc?._id && (
              <>
                <MenuItem
                  onClick={() => {
                    handleCreatePostClick();
                  }}
                >
                  <BsPencil style={{ marginRight: "8px" }} />
                  <Text>Sửa bài viết</Text>
                </MenuItem>
                <MenuItem onClick={deleteHandle}>
                  <BsTrash style={{ marginRight: "8px" }} />
                  <Text>Xóa bài viết</Text>
                </MenuItem>
              </>
            )}
            {ownerPost !== userAcc?._id && (
              <MenuItem onClick={() => {
                setReportReason('')
                onOpen()
                }}>
                <BsExclamationTriangle style={{ marginRight: "8px" }} />
                <Text>Báo cáo bài viết</Text>
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>
      {/* Report Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Báo cáo bài viết</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Vui lòng nhập lý do báo cáo:</Text>
            <Textarea
              placeholder="Lý do báo cáo..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              mt={2}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleReportSubmit}>
              Gửi báo cáo
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </CardHeader>
  );
};

export default HeaderRender;
