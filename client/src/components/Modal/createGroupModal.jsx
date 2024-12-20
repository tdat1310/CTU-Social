import React, { useState, useEffect, useContext } from "react";
import {
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Box,
  Avatar,
  Tooltip,
  Text,
  FormControl,
  FormLabel,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ImSearch } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import GroupApi from "../../apis/groupApi";
import { SocketContext } from "../../provider/socketContext";
import { fetchGroups } from "../../Redux/slices/groupSlice";

const CreateGroupModal = ({
  isModalOpen,
  setIsModalOpen,
  showToast,
  create,
  groupDetails,
}) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const userDetail = useSelector((state) => state.auth.userDetail);
  const dispatch = useDispatch()
  const followers = userDetail?.NguoiTheoDoi;
  const following = userDetail?.TheoDoi;
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!isModalOpen) {
      setNewGroupName("");
      setSelectedUsers([]);
      setSearchKeyword("");
      setShowSearch(false);
    }
  }, [isModalOpen]);

  const handleSubmitGroup = async () => {
    if (create && newGroupName.trim()) {
      const res = await GroupApi.createGroup("groups/create", {
        TruongNhom: userDetail._id,
        TenNhom: newGroupName.trim(),
      });

      setTimeout(() => {
        if (selectedUsers.length > 0) {
          socket.emit("inviteJoinGroup", {
            groupId: res._id,
            memberIds: selectedUsers.map((user) => user._id),
            inviterId: userDetail._id,
            groupName: res.TenNhom,
          });
        }
        showToast("success", "Thông báo", "Bạn đã tạo nhóm thành công");
        dispatch(
          fetchGroups({
            url: `groups/get/group/${userDetail._id}`,
          })
        );
        setIsModalOpen(false);
      }, 500);
    } else if (!create && selectedUsers.length > 0) {
      socket.emit("inviteJoinGroup", {
        memberIds: selectedUsers.map((user) => user._id),
        inviterId: userDetail._id,
        groupId: groupDetails._id,
      });
      showToast("success", "Thông báo", "Bạn đã mời thành viên thành công");
      setIsModalOpen(false);
    } else {
      alert(create ? "Vui lòng nhập tên nhóm" : "Vui lòng chọn người để mời");
    }
  };

  const handleUserSelection = (user) => {
    if (!selectedUsers.includes(user) && selectedUsers.length < 10) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  const filterUsers = (users) =>
    users.filter((user) =>
      user.userName.toLowerCase().includes(searchKeyword.toLowerCase())
    );

  const renderUserList = (users) =>
    users.length > 0 ? (
      users.map((user) => (
        <Box
          key={user._id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Avatar size="sm" />
            <Text ml={2}>{user.userName}</Text>
          </Box>
          <Button size="sm" onClick={() => handleUserSelection(user)}>
            Mời
          </Button>
        </Box>
      ))
    ) : (
      <Text>Không tìm thấy người dùng nào</Text>
    );

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) setSearchKeyword("");
  };

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {create ? "Tạo nhóm mới" : "Mời thành viên vào nhóm"}
          <Box mt={2} display="flex" flexWrap="wrap">
            {selectedUsers.map((user) => (
              <Box
                key={user._id}
                display="inline-block"
                position="relative"
                mr={2}
              >
                <Tooltip label={user.userName} placement="bottom">
                  <Avatar size="sm" />
                </Tooltip>
                <Box
                  position="absolute"
                  top="-1.5"
                  right="-1.5"
                  fontSize="10px"
                  onClick={() => removeUser(user)}
                  cursor="pointer"
                  bg="white"
                  shadow="md"
                  _hover={{ bg: "#eeeeee" }}
                  border="1px solid #DFE0DC"
                  p="2px 5px"
                  borderRadius="5px"
                >
                  <CloseIcon />
                </Box>
              </Box>
            ))}
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {create && (
            <FormControl isRequired>
              <FormLabel>Tên nhóm</FormLabel>
              <Input
                placeholder="Nhập tên nhóm"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </FormControl>
          )}
          <Flex alignItems="flex-start" mt={2} flexDirection="column">
            <>
              <FormLabel
                h={showSearch ? "20px" : "0"} // Sử dụng height để ẩn hiện input
                w={showSearch ? "100%" : "0"} // Sử dụng width để thay đổi kích thước input
                opacity={showSearch ? 1 : 0} // Điều chỉnh độ mờ dần
                visibility={showSearch ? "visible" : "hidden"} // Điều khiển sự hiển thị
              >
                Tìm kiếm
              </FormLabel>
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                transition="all 0.3s ease"
                h={showSearch ? "40px" : "0"} // Sử dụng height để ẩn hiện input
                w={showSearch ? "100%" : "0"} // Sử dụng width để thay đổi kích thước input
                opacity={showSearch ? 1 : 0} // Điều chỉnh độ mờ dần
                visibility={showSearch ? "visible" : "hidden"} // Điều khiển sự hiển thị của
              />
            </>
          </Flex>
          <Tabs index={activeTab} onChange={setActiveTab} variant={"unstyled"}>
            <TabList>
              <Tab
                _selected={{
                  color: "blue.500",
                  borderBottom: "2px solid",
                  borderColor: "blue.500",
                }}
              >
                Người theo dõi
              </Tab>
              <Tab
                _selected={{
                  color: "blue.500",
                  borderBottom: "2px solid",
                  borderColor: "blue.500",
                }}
              >
                Đang theo dõi
              </Tab>
              <Box
                onClick={handleSearchToggle}
                ml="80px"
                mt="15px"
                fontSize="20px"
                cursor="pointer"
              >
                <ImSearch />
              </Box>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box maxHeight="150px" overflowY="auto" px={4}>
                  {renderUserList(filterUsers(followers))}
                </Box>
              </TabPanel>
              <TabPanel>
                <Box maxHeight="150px" overflowY="auto" px={4}>
                  {renderUserList(filterUsers(following))}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmitGroup}>
            {create ? "Tạo nhóm" : "Mời"}
          </Button>
          <Button ml={3} onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateGroupModal;
