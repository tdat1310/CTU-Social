import {
  Box,
  Flex,
  Text,
  IconButton,
  Grid,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  Avatar,
  Link
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdOutlineFileDownload } from "react-icons/md";
import GetIconByMimeType from "../../utils/GetIconByMimeType";

const InfoChatModal = ({ memberSection, userDetail }) => {
  const [currentView, setCurrentView] = useState("info"); // Trạng thái hiện tại của layout
  const [isModalOpen, setIsModalOpen] = useState(false); // State để điều khiển modal
  const [selectedImage, setSelectedImage] = useState(null); // State để lưu trữ ảnh được chọn

  const messages = useSelector((state) => state.chat.message);

  // Lọc ra các message có file và phân loại theo type
  const chatPicMessages = messages.filter(
    (message) => message.file && message.file.type === "chat-pic"
  );

  const chatFileMessages = messages.filter(
    (message) => message.file && message.file.type === "chat-file"
  );

  // Hàm chuyển đổi layout
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Hàm xử lý khi click vào ảnh
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true); // Mở modal
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null); // Đặt lại ảnh đã chọn khi đóng modal
  };
  return (
    <Box
      w="35%"
      p={4}
      bg="gray.50"
      borderLeft="1px solid #e2e8f0"
      display="flex"
      flexDirection="column"
    >
      {currentView === "info" && (
        <>
          <Box mb={4} fontWeight="bold">
            Thông tin chi tiết
          </Box>

          {/* Mục Ảnh */}
          <Box mb={4}>
            <Text fontWeight="bold" mb={2}>
              Kho ảnh
            </Text>
            <Flex>
              <Box
                as="button"
                color={'whitesmoke'}
                fontWeight={'600'}
                bg="#2d5be4"
                _hover={{
                  transform: 'scale(1.03)'
                }}
                transition={'0.3s'}
                onClick={() => handleViewChange("photos")}
                
                p={2}
                borderRadius="md"
                mr={2}
              >
                Xem tất cả
              </Box>
            </Flex>
          </Box>

          {/* Mục File */}
          <Box mb={4}>
            <Text fontWeight="bold" mb={2}>
              Kho file
            </Text>
            <Flex>
              <Box
                as="button"
                onClick={() => handleViewChange("files")}
                color={'whitesmoke'}
                fontWeight={'600'}
                bg="#2d5be4"
                _hover={{
                  transform: 'scale(1.03)'
                }}
                transition={'0.3s'}
                p={2}
                borderRadius="md"
              >
                Xem tất cả
              </Box>
            </Flex>
          </Box>

          {/* Mục thành viên */}
          {memberSection!='' && (
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Thành viên
              </Text>
              <Flex>
                <Box
                
                  as="button"
                  onClick={() => handleViewChange("members")}
                  color={'whitesmoke'}
                  fontWeight={'600'}
                  bg="#2d5be4"
                  _hover={{
                    transform: 'scale(1.03)'
                  }}
                  transition={'0.3s'}
                  p={2}
                  borderRadius="md"
                >
                  Xem tất cả
                </Box>
              </Flex>
            </Box>
          )}
        </>
      )}

      {currentView === "photos" && (
        <>
          <Flex mb={4} alignItems="center" justifyContent="space-between">
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => handleViewChange("info")}
              variant="ghost"
              aria-label="Quay lại"
            />
            <Text fontWeight="bold" mr={"10px"}>
              Kho ảnh
            </Text>
          </Flex>

          {/* Hiển thị ảnh trống nếu không có ảnh nào */}
          {chatPicMessages.length === 0 && (
            <Flex
              justifyContent="center"
              alignItems="center"
              h="300px"
              w="100%"
              mb={4}
            >
              <Image
                src={"/src/assets/no-data.png"}
                alt="Ảnh trống"
                objectFit="contain"
              />
            </Flex>
          )}

          {/* Grid ảnh */}
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={4}
            overflowY="auto" // Cho phép cuộn dọc khi vượt quá chiều cao
          >
            {chatPicMessages.map((message, index) => (
              <Box
                key={index}
                bg="gray.200"
                p={2}
                borderRadius="md"
                onClick={() => handleImageClick(message.file.display_url)} // Khi nhấn vào ảnh
              >
                <Image
                  src={message.file.display_url}
                  alt={`Ảnh ${index + 1}`}
                  borderRadius="md"
                  boxSize="110px" // Kích thước ảnh, có thể tùy chỉnh
                  objectFit="cover" // Đảm bảo ảnh vừa với khung
                  cursor="pointer" // Thêm con trỏ pointer khi hover vào ảnh
                />
              </Box>
            ))}
          </Grid>
        </>
      )}

      {currentView === "files" && (
        <>
          <Flex mb={4} alignItems="center" justifyContent="space-between">
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => handleViewChange("info")}
              variant="ghost"
              aria-label="Quay lại"
            />
            <Text fontWeight="bold" mr={"10px"}>
              Kho file
            </Text>
          </Flex>

          {/* Hiển thị file trống nếu không có file nào */}
          {chatFileMessages.length === 0 && (
            <Flex
              justifyContent="center"
              alignItems="center"
              h="300px"
              w="100%"
              mb={4}
            >
              <Image
                src={"/src/assets/no-data.png"}
                alt="Không có file nào"
                objectFit="contain"
              />
            </Flex>
          )}

          {/* Danh sách file */}
          <Box overflowY="auto" p={4} borderRadius="md">
            {chatFileMessages.map((message, index) => (
              <Flex
                key={index}
                color={'whitesmoke'}
                fontWeight={'600'}
                bg="#2d5be4"
                _hover={{
                  transform: 'scale(1.01)'
                }}
                transition={'0.3s'}
                p={2}
                borderRadius="md"
                mb={2}
                justifyContent={"space-between"}
              >
                <Flex gap={"10px"} alignItems={'center'}>
                  <Box fontSize={"20px"}>
                    <GetIconByMimeType mimeType={message.file.mimeType} />
                  </Box>
                  <Text isTruncated textOverflow="ellipsis" maxW="250px">
                    {message.file.name_file}
                  </Text>
                </Flex>
                <Link fontSize={"25px"} mt={"2px"} cursor={'pointer'} href={message.file.download_url}>
                  <MdOutlineFileDownload />
                </Link>
              </Flex>
            ))}
          </Box>
        </>
      )}

      {/* Hiển thị danh sách thành viên */}
      {currentView === "members" && (
  <>
    <Flex mb={4} alignItems="center" justifyContent="space-between">
      <IconButton
        icon={<ArrowBackIcon />}
        onClick={() => handleViewChange("info")}
        variant="ghost"
        aria-label="Quay lại"
      />
      <Text fontWeight="bold" mr={"10px"}>
        Danh sách thành viên
      </Text>
    </Flex>

    <Box overflowY="auto" maxH="300px" p={2}>
      {memberSection[0]?.otherUser.length === 0 ? (
        <Text>Không có thành viên nào.</Text>
      ) : (
        <>
          <Flex alignItems="center" p={2} bg="gray.100" borderRadius="md" mb={2}>
            <Avatar boxSize="40px" borderRadius="full" mr={2} />
            <Text ml={'10px'}>{userDetail.userName}</Text>
          </Flex>

          {memberSection[0]?.otherUser.map((member) => (
            <Flex
              key={member._id}
              alignItems="center"
              p={2}
              bg="gray.100"
              borderRadius="md"
              mb={2}
            >
              <Avatar boxSize="40px" borderRadius="full" mr={2} />
              <Text ml={'10px'}>{member.userName}</Text>
            </Flex>
          ))}
        </>
      )}
    </Box>
  </>
)}


      {/* Modal hiển thị ảnh lớn */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Full-sized chat image"
              objectFit="contain"
            />
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InfoChatModal;
