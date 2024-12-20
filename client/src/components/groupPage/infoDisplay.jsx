/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Flex,
  Text,
  Image,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AvatarGroup,
  Button,
  Badge,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { ImPlus } from "react-icons/im";

import { fetchGroupDetails } from "../../Redux/slices/groupSlice";
import GroupApi from "../../apis/groupApi";

const InfoDisplay = ({
  groupDetails,
  isLeader,
  isMember,
  socket,
  onEditOpen,
  navigate,
  userDetail,
  group_id,
  dispatch,
  post,
  setIsRequestOpen,
  requestCount,
  filteredRequests,
  onMemberOpen,
  setIsInviteOpen,
}) => {
  return (
    <>
      {/* Phần bìa nhóm */}
      <Box position="relative" mb={6}>
        <Image
          src={
            groupDetails.coverPic
              ? groupDetails.coverPic.display_url
              : "/src/assets/no-cover.png"
          }
          alt="Bìa Nhóm"
          borderRadius="md"
          w={'100%'}
          height="250px"
          objectFit="cover"
        />
        <Box
          position="absolute"
          bottom={4}
          left={4}
          bg="rgba(0, 0, 0, 0.6)"
          p={3}
          borderRadius="md"
        >
          <Text fontSize="3xl" color="white" fontWeight="bold">
            {groupDetails.TenNhom}
          </Text>
        </Box>

        {isMember && (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<SettingsIcon />}
              variant="outline"
              bgColor={"white"}
              position="absolute"
              top={2}
              right={2}
              aria-label="Options"
              size="lg"
              zIndex={1}
            />
            <MenuList>
              {isLeader && (
                <>
                  <MenuItem
                    onClick={() => {
                      // dispatch(
                      //   fetchGroupDetails(
                      //     `groups/get/group/detail/${group_id}?post=${post}`
                      //   )
                      // );
                      onEditOpen();
                    }}
                  >
                    Sửa thông tin nhóm
                  </MenuItem>
                  <MenuItem
                    color="red.500"
                    onClick={async () => {
                      socket.emit("navigate", {
                        listUser: groupDetails.ThanhVien.filter(
                          (a) => a._id !== groupDetails.TruongNhom._id
                        ),
                      });
                      setTimeout(async () => {
                        await GroupApi.deleteGroup(
                          `groups/deleteGroup/${groupDetails._id}`
                        );
                        navigate("/group");
                      }, 300);
                    }}
                  >
                    Xóa nhóm
                  </MenuItem>
                </>
              )}
              <MenuItem
                color="orange.500"
                onClick={async () => {
                  await GroupApi.leaveGroup("groups/leaveGroup", {
                    groupId: groupDetails._id,
                    userId: userDetail._id,
                  });
                  setTimeout(() => {
                    dispatch(
                      fetchGroupDetails(
                        `groups/get/group/detail/${group_id}?post=${post}`
                      )
                    );
                  }, 500);
                }}
              >
                Rời nhóm
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Box>
      {/* Nút yêu cầu tham gia */}
      {!isMember && (
        <Box w={"100%"} display={"flex"} justifyContent={"right"}>
          <Button
            bg={"#2e5be0"}
            _hover={{
              bg: "#234ca1",
            }}
            color={"white"}
            onClick={() => {
              socket.emit("approve_join_request", {
                groupId: groupDetails._id,
                requesterId: userDetail._id,
                groupName: groupDetails.TenNhom,
              });
            }}
            mb={4}
          >
            Yêu cầu tham gia
          </Button>
        </Box>
      )}

      {/* Phần giới thiệu nhóm */}
      <Box
        borderWidth={1}
        border="1px solid #DFE0DC"
        borderRadius="lg"
        p={4}
        mb={6}
        boxShadow="sm"
        bg="white"
      >
        <Text fontSize="lg">{groupDetails.MoTa}</Text>
      </Box>
      <>
        {isMember &&
          (isLeader ||
            groupDetails?.RoleGroup?.accept?.includes(userDetail?._id)) && (
            <Button
              bg={"#2e5be0"}
              _hover={{
                bg: "#234ca1",
              }}
              color={"white"}
              onClick={() => setIsRequestOpen(true)}
              position="relative"
            >
              Duyệt yêu cầu tham gia
              {requestCount > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="-10px"
                  right="-10px"
                  fontSize="0.8em"
                  paddingBlock="5px"
                  paddingInline="10px"
                >
                  {filteredRequests.length}
                </Badge>
              )}
            </Button>
          )}
      </>

      {/* Danh sách thành viên */}
      <Box
        borderWidth={1}
        borderColor="gray.400"
        borderRadius="lg"
        p={4}
        mb={6}
        boxShadow="sm"
        bg="white"
      >
        <Flex alignItems={"center"} mb={4} gap={"10px"}>
          <Text fontSize="xl" fontWeight="bold">
            Thành viên ({groupDetails.ThanhVien.length})
          </Text>
          {isMember &&
            (isLeader ||
              groupDetails?.RoleGroup?.invite?.includes(userDetail?._id)) && (
              <Box
                _hover={{
                  transform: "scale(1.1)",
                  transition: "0.2s",
                }}
                onClick={() => {
                  setIsInviteOpen(true);
                }}
                cursor={"pointer"}
              >
                <ImPlus />
              </Box>
            )}
        </Flex>
        <AvatarGroup max={4} cursor={"pointer"}>
          {groupDetails.ThanhVien.map((user) => (
            <Avatar
              size="md"
              key={user._id}
              src={user.avtPic ? user.avtPic.display_url : '/src/assets/no-avt.png'}
              border={"3.5px solid #2d5be4"}
              onClick={onMemberOpen}
            />
          ))}
        </AvatarGroup>
      </Box>
    </>
  );
};

export default InfoDisplay;
