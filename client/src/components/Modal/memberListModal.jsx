import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Text,
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SearchIcon, StarIcon } from "@chakra-ui/icons"; // Icon tìm kiếm và ngôi sao
import GroupApi from "../../apis/groupApi";
import { useDispatch } from "react-redux";
import { fetchGroupDetails } from "../../Redux/slices/groupSlice";

const MemberListModal = ({ isOpen, onClose, members, groupDetails, userDetail }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  // Lọc danh sách thành viên dựa trên giá trị tìm kiếm
  const filteredMembers = members?.filter((member) =>
    member.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log(members)
  // Hàm phân quyền
  const toggleRole = async (member, roleType) => {
    const action = groupDetails.RoleGroup[roleType].includes(member._id)
      ? "remove"
      : "add";
    await GroupApi.addAcceptRole("groups/add/role/accept", {
      groupId: groupDetails._id,
      userId: member._id,
      action,
      roleType,
    });

    dispatch(
      fetchGroupDetails(`groups/get/group/detail/${groupDetails._id}?post=${3}`)
    );
  };

  // Hàm kiểm tra các quyền của người dùng
  const getUserRoles = (member) => {
    let roles = [];
    if (groupDetails.RoleGroup.accept.includes(member._id))
      roles.push("+ Duyệt yêu cầu");
    if (groupDetails.RoleGroup.invite.includes(member._id))
      roles.push("+ Mời người dùng");

    return roles.length > 0 ? roles.join("\n") : "Không có quyền";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Danh sách thành viên</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Thanh tìm kiếm */}
          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {/* Danh sách thành viên */}
          <Box maxHeight="400px" overflowY="auto" w={"100%"}>
            <Flex flexDirection={"column"} gap={"10px"}>
              {filteredMembers?.map((member, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                  borderBottom="1px solid #eaeaea"
                >
                  <Flex alignItems="center">
                    <Avatar src={member.avtPic ? member.avtPic.display_url : '/src/assets/no-avt.png'} />
                    <Text ml={4}>{member.userName}</Text>

                    {/* Hiển thị Tooltip chỉ khi không phải là trưởng nhóm */}
                    {member._id !== groupDetails.TruongNhom._id && (
                      <Tooltip
                        label={getUserRoles(member)}
                        fontSize="md"
                        whiteSpace="pre-line"
                      >
                        <IconButton
                          aria-label="Các quyền"
                          icon={<StarIcon />}
                          variant="ghost"
                          size="sm"
                          ml={4}
                          _hover={{ bg: "yellow.100" }}
                        />
                      </Tooltip>
                    )}
                  </Flex>

                  {/* Dropdown chứa các nút phân quyền */}
                  <Box>
                    {member._id === groupDetails.TruongNhom._id ? (
                      <Button colorScheme="yellow" size="sm" isDisabled>
                        Trưởng nhóm
                      </Button>
                    ) : (
                      userDetail._id === groupDetails.TruongNhom._id &&
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<StarIcon />}
                          colorScheme="teal"
                          size="sm"
                        >
                          Phân quyền
                        </MenuButton>
                        <MenuList
                          w={"100px"}
                          border="1px solid #DFE0DC"
                          shadow={"md"}
                        >
                          {/* Quyền duyệt yêu cầu tham gia */}
                          <MenuItem
                            onClick={() => toggleRole(member, "accept")}
                            color={
                              groupDetails.RoleGroup.accept.includes(member._id)
                                ? "red.500"
                                : "black"
                            }
                          >
                            {groupDetails.RoleGroup.accept.includes(member._id)
                              ? "Xóa quyền duyệt yêu cầu"
                              : "Duyệt yêu cầu tham gia"}
                          </MenuItem>

                          {/* Quyền mời người khác vào */}
                          <MenuItem
                            onClick={() => toggleRole(member, "invite")}
                            color={
                              groupDetails.RoleGroup.invite.includes(member._id)
                                ? "red.500"
                                : "black"
                            }
                          >
                            {groupDetails.RoleGroup.invite.includes(member._id)
                              ? "Xóa quyền mời người dùng"
                              : "Mời người dùng"}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </Box>
                </Box>
              ))}
            </Flex>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MemberListModal;
