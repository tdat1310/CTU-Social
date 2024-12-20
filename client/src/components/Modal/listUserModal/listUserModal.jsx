import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  Button,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { HiX, HiSearch } from "react-icons/hi"; // Import icon kính lúp
import ListUser from "./listUser"; // Import ListUser từ file riêng
import { ChatApi } from "../../../apis/chatApi";
import { loadAllMessage, loadAllRoom } from "../../../Redux/slices/chatSlice";
import { ImSearch } from "react-icons/im";
import { reloadData } from "../../../Redux/slices/authSlice";
const ListUserModal = ({
  isOpen,
  onClose,
  userDetail,
  boxChatList,
  dispatch,
  socket,
  addState,
  setAddState,
  setSelectedChat,
  selectedChat,
}) => {
  const [addedUsers, setAddedUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [error, setError] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // State để điều khiển hiển thị input

  // Hàm để reset trạng thái và đóng modal
  const handleModalClose = () => {
    setAddedUsers([]); // Reset addedUsers
    setShowSearch(false); // Reset showSearch
    setSearchKeyword(""); // Reset searchKeyword nếu cần
    onClose(); // Gọi hàm onClose để tắt modal
  };

  const recentUsers =
    boxChatList
      ?.filter((chat) => chat.type === "user")
      .map((chat) => chat.otherUser) || [];

  const handleAddUser = (user) => {
    if (addedUsers.length >= 10) {
      setError(true);
      return;
    }
    if (!addedUsers.some((addedUser) => addedUser._id === user._id)) {
      setError(false);
      setAddedUsers([...addedUsers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setAddedUsers(addedUsers.filter((user) => user._id !== userId));
  };

  const handleCreateGroup = async () => {
    try {
      await ChatApi.createGroupChat("chat/createGroupChat", {
        userId: userDetail._id,
        groupChatName:
          addedUsers.map((user) => user.userName).join(", ") +
          "," +
          userDetail.userName,
        memberIds: addedUsers.map((user) => user._id),
      });
      setTimeout(() => {
        dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
        dispatch(reloadData(`accounts/reload/${userDetail._id}`));
        socket.emit("createGroupChat", {
          memberIds: addedUsers.map((user) => user._id),
          owner: userDetail._id,
          type: 'group'
        });
      }, 500);
      handleModalClose(); // Đóng modal và reset state
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddMember = async () => {
    try {
      const res = await ChatApi.addMemberToGroupChat(
        "chat/addMemberToGroupChat",
        {
          roomId: selectedChat,
          memberIds: addedUsers.map((user) => user._id),
          userId: userDetail._id,
        }
      );
      setTimeout(() => {
        dispatch(loadAllRoom(`chat/get/room/${userDetail._id}`));
        dispatch(loadAllMessage(`chat/messages/${selectedChat}`));
        socket.emit("AddMemberGroupChat", {
          memberIds: res.existingMembers,
        });
        socket.emit("createGroupChat", {
          memberIds: res.newMembers,
          owner: userDetail._id,
          type: 'group'
        });
      }, 500);
      handleModalClose(); // Đóng modal và reset state
    } catch (error) {
      console.log(error);
    }
  };
  const tabTitles = ["Gần đây", "Người theo dõi", "Theo dõi"];
  const usersData = [
    recentUsers,
    userDetail?.NguoiTheoDoi || [],
    userDetail?.TheoDoi || [],
  ];

  const filteredUsers = (users) =>
    users.filter((user) =>
      user.userName?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  const modalName = () => {
    if (addState === "group") return "Tạo nhóm chat mới";
    if (addState === "user") return "Liên hệ";
    if (addState === "addMember") return "Thêm thành viên";
  };
  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent h="510px">
        <ModalHeader>{modalName()}</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          position={"relative"}
          display="flex"
          flexDirection="column"
          h="full"
        >
          <Flex alignItems="center" mb={4}>
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              transition="all 0.3s ease"
              h={showSearch ? "40px" : "0"} // Sử dụng height để ẩn hiện input
              w={showSearch ? "100%" : "0"} // Sử dụng width để thay đổi kích thước input
              opacity={showSearch ? 1 : 0} // Điều chỉnh độ mờ dần
              visibility={showSearch ? "visible" : "hidden"} // Điều khiển sự hiển thị của input
            />
          </Flex>

          {addedUsers.length > 0 && (
            <Box mb={5}>
              <Text fontWeight="bold" mb={3}>
                Người dùng đã thêm:
              </Text>
              <Flex>
                {addedUsers.map((user) => (
                  <Box key={user._id} position="relative" mr={2}>
                    <Tooltip label={user.userName} aria-label="Username">
                      <Avatar size="sm" name={user.userName} />
                    </Tooltip>
                    <IconButton
                      icon={<HiX />}
                      aria-label="Remove user"
                      size="xs"
                      position="absolute"
                      borderColor={"#DFE0DC"}
                      top="-10px"
                      right="-10px"
                      bg={"white"}
                      onClick={() => handleRemoveUser(user._id)}
                      variant="outline"
                      borderRadius="full"
                    />
                  </Box>
                ))}
              </Flex>
              {error && (
                <Text color={"red"} mt={"5px"}>
                  Khi tạo nhóm bạn chỉ thêm tối đa được 10 thành viên
                </Text>
              )}
            </Box>
          )}

          <Tabs variant="enclosed" flexGrow={1} overflow="hidden">
            <TabList borderBottom="1px solid #DFE0DC">
              {tabTitles.map((title, index) => (
                <Tab key={index} border={"1px solid #DFE0DC"}>
                  {title}
                </Tab>
              ))}
              <Box
                onClick={() => {
                  setShowSearch(!showSearch);
                  setSearchKeyword("");
                }}
                ml={"35px"}
                mt={"10px"}
                fontSize={"20px"}
                cursor={"pointer"}
              >
                <ImSearch />
              </Box>
            </TabList>
            <TabPanels>
              {usersData.map((userList, index) => (
                <TabPanel key={index} overflowY="auto" maxHeight="350px">
                  <ListUser
                    users={filteredUsers(userList)}
                    handleAddUser={handleAddUser}
                    addState={addState}
                    dispatch={dispatch}
                    userDetail={userDetail}
                    onClose={onClose}
                    setSelectedChat={setSelectedChat}
                    handleAddMember={handleAddMember}
                    socket={socket}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>

          {addedUsers.length > 0 && (
            <Button
              bottom={"6%"}
              right={"5%"}
              position={"absolute"}
              colorScheme="blue"
              onClick={() => {
                addState === "addMember"
                  ? handleAddMember()
                  : handleCreateGroup();
              }}
            >
              {addState === "addMember" ? "Thêm" : "Tạo"}
            </Button>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ListUserModal;
