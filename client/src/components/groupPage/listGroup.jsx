import React, { useState } from "react";
import {
  VStack,
  Box,
  Input,
  Icon,
  Button,
  InputGroup,
  InputLeftElement,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const ListGroup = ({
  searchTerm,
  setSearchTerm,
  userGroups,
  handleCreateGroup,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState(""); // Trạng thái tìm kiếm trong modal
  const [visibleGroups] = useState(5); // Hiển thị cố định 4 nhóm ban đầu
  const navigate = useNavigate();
  const handleShowMore = () => {
    setModalOpen(true); // Mở modal khi bấm nút "Xem thêm"
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Đóng modal
  };

  // Lọc danh sách nhóm dựa trên từ khóa tìm kiếm trong modal
  const filteredGroups = userGroups.filter((group) =>
    group.TenNhom.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  return (
    <>
      <VStack
        bg="gray.100"
        h="81vh"
        p={4}
        spacing={4}
        align="flex-start"
        onClick={() => {}}
        cursor={"pointer"}
      >
        <Box w="100%">
          <InputGroup>
            <InputLeftElement>
              <Icon as={SearchIcon} />
            </InputLeftElement>
            <Input
              placeholder="Tìm nhóm..."
              size="md"
              borderRadius="md"
              variant="outline"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>
        <Button onClick={handleCreateGroup} colorScheme="blue" w="100%">
          Tạo nhóm
        </Button>

        {userGroups
          .filter((group) =>
            group.TenNhom.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, visibleGroups)
          .map((group) => (
            <Box
              key={group._id}
              bg="white"
              p={2}
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
              h={"60px"}
              w={"100%"}
              boxShadow="md"
              onClick={() => {
                navigate(`/group/${group._id}`);
              }}
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  borderRadius="10px"
                  w="40px"
                  h="40px"
                  mr={3}
                  src={group.coverPic ? group.coverPic.display_url : ""}
                />
                <Flex flexDirection={"column"}>
                  <Box fontWeight="bold">{group.TenNhom}</Box>

                  <Box fontSize="sm" color="gray.600" fontWeight="medium">
                    {group.ThanhVien?.length || 0} thành viên
                  </Box>
                </Flex>
              </Box>
            </Box>
          ))}
      </VStack>

      {/* Modal hiển thị danh sách group đầy đủ */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Danh sách nhóm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Thanh tìm kiếm trong modal */}
            <InputGroup mb={4}>
              <InputLeftElement>
                <Icon as={SearchIcon} />
              </InputLeftElement>
              <Input
                placeholder="Tìm kiếm nhóm..."
                size="md"
                borderRadius="md"
                variant="outline"
                value={modalSearchTerm}
                onChange={(e) => setModalSearchTerm(e.target.value)}
              />
            </InputGroup>

            {/* Vùng danh sách có thể cuộn */}
            <Box maxH="300px" overflowY="auto" w={"100%"}>
              <VStack spacing={4} align="flex-start" w={"95%"} m={"0 auto"}>
                {filteredGroups.map((group) => (
                  <Box
                    key={group._id}
                    bg="white"
                    p={2}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    mb={2}
                    cursor={"pointer"}
                    h={"60px"}
                    w={"100%"}
                    boxShadow="md"
                    border="1px solid #DFE0DC"
                    onClick={() => {
                      navigate(`/group/${group._id}`);
                    }}
                  >
                    <Avatar
                      borderRadius="10px"
                      w="40px"
                      h="40px"
                      mr={3}
                      src={group.coverPic ? group.coverPic.display_url : ""}
                    />
                    <Box fontWeight="bold">{group.TenNhom}</Box>
                  </Box>
                ))}
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCloseModal}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListGroup;
