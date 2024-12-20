import {
  Box,
  Image,
  SimpleGrid,
  Text,
  Flex,
  Tooltip,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaRegShareFromSquare } from "react-icons/fa6";
import {
  blogDetailClear,
  reloadDetailBlog,
} from "../../Redux/slices/blogSlice";

const PicDisplay = ({ photos, dispatch, navigate, userDetail, isMember }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const onOpen = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedImage("");
  };

  return (
    <Box w={"100%"}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Ảnh
      </Text>
      {isMember ? (
        photos.length === 0 ? (
          <Flex w={"100%"} justifyContent={"center"}>
            <Image w={"30%"} src="/src/assets/no-pic.png" h={"350px"} />
          </Flex>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={5} w={"100%"}>
            {photos.map((photo) => (
              <Box position="relative" key={photo.attachmentId}>
                <Image
                  cursor={"pointer"}
                  h={"200px"}
                  src={photo.url}
                  borderRadius="md"
                  border="1px solid #DFE0DC"
                  shadow={"md"}
                  w={"100%"}
                  objectFit="cover"
                  onClick={() => onOpen(photo.url)} // Mở modal khi nhấn vào ảnh
                />
                <Tooltip label={"Đi tới bài viết"} hasArrow>
                  <IconButton
                    icon={
                      <Box fontSize={"18px"}>
                        <FaRegShareFromSquare />
                      </Box>
                    }
                    aria-label="More options"
                    position="absolute"
                    top={2}
                    border="1px solid #DFE0DC"
                    shadow={"md"}
                    bg={"white"}
                    onClick={() => {
                      dispatch(blogDetailClear());
                      dispatch(
                        reloadDetailBlog(`posts/reload/${photo.postId}`)
                      );
                      setTimeout(() => {
                        userDetail._id === photo.uploadedBy._id
                          ? navigate(`/account/user/post/${photo.postId}`)
                          : navigate(
                              `/account/guest/${photo.uploadedBy._id}/post/${photo.postId}`
                            );
                      }, 1000);
                    }}
                    right={2}
                    variant="ghost"
                    size="sm"
                  />
                </Tooltip>
              </Box>
            ))}
          </SimpleGrid>
        )
      ) : (
        <Text fontSize="lg" color="gray.500" p={3}>
        Bạn không phải là thành viên của nhóm này, nên không thể
        xem các ảnh.
      </Text>
      )}

      {/* Modal hiển thị ảnh */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={0}>
          <ModalBody display="flex" justifyContent="center" p={0}>
            <Image
              src={selectedImage}
              W="100%"
              objectFit="contain"
              maxH="90vh" // Tăng chiều cao tối đa
              maxW="90vw" // Tăng chiều rộng tối đa
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PicDisplay;
