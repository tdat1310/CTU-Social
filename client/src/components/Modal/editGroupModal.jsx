import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Image,
  Box,
} from "@chakra-ui/react";

const EditGroupModal = ({ isOpen, onClose, onUpdate, groupDetails }) => {
  // Gán thẳng giá trị từ groupDetails
  // console.log(groupDetails)
  const name = groupDetails.TenNhom;
  const description = groupDetails.MoTa;
  const imagePreview = groupDetails.coverPic
    ? groupDetails.coverPic.display_url
    : "/src/assets/no-cover.png";

  // State chỉ cho các giá trị có thể thay đổi trong quá trình chỉnh sửa
  const [coverImage, setCoverImage] = React.useState(null);
  const [editedName, setEditedName] = React.useState(name);
  const [editedDescription, setEditedDescription] = React.useState(description);
  const [previewImage, setPreviewImage] = React.useState(imagePreview);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(file);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    const updates = {};
    if (editedName !== name) {
      updates.name = editedName;
    }
    if (editedDescription !== description) {
      updates.description = editedDescription;
    }
    if (coverImage) {
      updates.coverImage = coverImage;
    }

    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sửa thông tin nhóm</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Tên nhóm</FormLabel>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Mô tả nhóm</FormLabel>
            <Input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Tải ảnh bìa</FormLabel>
            <Button as="label" htmlFor="upload-button" colorScheme="blue">
              Tải ảnh lên
            </Button>
            <Input
              id="upload-button"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            {previewImage && (
              <Box mt={2}>
                <Image
                  src={previewImage}
                  alt="Preview"
                  width="100%"
                  height="200px"
                  objectFit="cover"
                  borderRadius="md"
                />
              </Box>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleUpdate}>
            Cập nhật
          </Button>
          <Button onClick={onClose} ml={3}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditGroupModal;
