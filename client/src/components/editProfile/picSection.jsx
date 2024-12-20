import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  Image,
  Text,
  Flex,
} from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";
import AttachApi from "../../apis/attachApi";
import { UserApi } from "../../apis/userApi";
import { useDispatch } from "react-redux";
import { reloadData } from "../../Redux/slices/authSlice";

const PicSection = ({
  cover,
  handleCoverChange,
  handleAvatarChange,
  avatar,
  showToast,
  setAvatar,
  setCover,
  storePic,
  userDetail,
  initalCover,
  initalAvatar
}) => {
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  // const initalCover =
  //   "https://images.unsplash.com/photo-1521747116042-5a810fda9664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fG5hdHVyZXxlbnwwfHx8fDE2OTgwNjMyMTY&ixlib=rb-1.2.1&q=80&w=1080";
  // const initalAvatar =
  //   "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHBlcnNvbnxlbnwwfHx8fDE2OTgwNjI5OTk&ixlib=rb-1.2.1&q=80&w=400";
  const dispatch = useDispatch()
  const handleCoverChangeWrapper = (event) => {
    handleCoverChange(event);
    setIsImageUploaded(true);
  };

  const handleAvatarChangeWrapper = (event) => {
    handleAvatarChange(event);
    setIsImageUploaded(true);
  };

  return (
    <Box
      border="1px"
      borderColor="gray.300"
      borderRadius="lg"
      p={4}
      h={"670px"}
      bg={'white'}
      shadow={'md'}
    >
      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Ảnh Cá Nhân
      </Text>

      <FormControl mb={10}>
        <FormLabel fontWeight="bold" fontSize="lg">
          Ảnh Bìa
        </FormLabel>
        <Box
          width="100%"
          height="200px"
          bg="gray.200"
          borderRadius="lg"
          position="relative"
          overflow="hidden"
          _hover={{ opacity: 0.9 }}
          transition="0.3s"
        >
          {cover ? (
            <Image
              src={cover}
              alt="Cover"
              objectFit="cover"
              w="100%"
              h="100%"
            />
          ) : (
            <Box w="100%" h="100%" bg="gray.300" />
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleCoverChangeWrapper}
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            w="100%"
            h="100%"
            cursor="pointer"
          />
        </Box>
        <Text mt={3} fontSize="md" color="gray.500">
          Chọn ảnh bìa từ máy tính
        </Text>
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="bold" fontSize="lg">
          Ảnh Đại Diện
        </FormLabel>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Avatar src={avatar} size="2xl" />
          <Box
            as="label"
            htmlFor="avatar-upload"
            position="absolute"
            bottom="12"
            right="15%"
            bg="blue.500"
            color="white"
            borderRadius="full"
            padding={2}
            
            bgColor={"#2d5be4"}
            _hover={{ bg: "#234ca1", cursor: "pointer" }}
          >
            <FaCamera />
          </Box>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChangeWrapper}
            hidden
          />
        </Box>
        <Text mt={3} fontSize="md" color="gray.500" textAlign="center">
          Chọn ảnh đại diện từ máy tính
        </Text>
      </FormControl>

      {isImageUploaded && (
        <Flex w={"100%"} justifyContent={"center"}>
          <Button
            mt={4}
            colorScheme="blue"
            size="lg"
            onClick={ async () => {
              // Logic lưu ảnh
              // console.log(storePic.avt[0])
              setIsImageUploaded(false); // Reset lại trạng thái
              let avt, cover;

              if (storePic.avt[0]) {
                avt = await AttachApi.createAttach(
                  `accounts/uploadPic/${userDetail._id}`,
                  [storePic.avt[0]],
                  "user",
                  "hello",
                  userDetail._id
                );
              }
              
              if (storePic.cover[0]) {
                cover = await AttachApi.createAttach(
                  `accounts/uploadPic/${userDetail._id}`,
                  [storePic.cover[0]],
                  "user",
                  "hello",
                  userDetail._id
                );
              }
              console.log(avt, cover)
              const updateData = {};
      
                 if (avt) updateData.avtPic = avt[0]._id;
                 if (cover) updateData.coverPic = cover[0]._id;
           
             
              console.log(updateData)
              if (Object.keys(updateData).length) {
                const res = await UserApi.updateInfo(`accounts/updateProfile/${userDetail._id}`, updateData);
              
                showToast(
                  "Lưu ảnh thành công!",
                  "Ảnh đại diện và ảnh bìa đã được lưu."
                );
              }
              
              
              
            }}
          >
            Lưu
          </Button>
          <Button
            mt={4}
            ml={4}
            colorScheme="gray"
            size="lg"
            onClick={() => {
              setAvatar(initalAvatar);
              setCover(initalCover);
              setIsImageUploaded(false); // Reset lại trạng thái              
            }}
          >
            Hủy
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default PicSection;
