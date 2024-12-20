import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import { UserApi } from "../../apis/userApi";
import { useDispatch } from "react-redux";
import { reloadData } from "../../Redux/slices/authSlice";

const AuthSection = ({
  email,
  setEmail,
  newPassword,
  setNewPassword,
  oldPassword,
  setOldPassword,
  showToast,
  userDetail,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    oldPassword: false,
    newPassword: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const dispatch = useDispatch();
  const handleSaveClick = async () => {
    const newErrors = {};
    const newErrorMessages = {};

    // Kiểm tra email
    if (!email.trim()) {
      newErrors.email = true;
      newErrorMessages.email = "Email không được để trống.";
    }

    // // Kiểm tra mật khẩu cũ
    // if (!oldPassword.trim()) {
    //   newErrors.oldPassword = true;
    //   newErrorMessages.oldPassword = "Mật khẩu cũ không được để trống.";
    // }

    // // Kiểm tra mật khẩu mới
    // if (!newPassword.trim()) {
    //   newErrors.newPassword = true;
    //   newErrorMessages.newPassword = "Mật khẩu mới không được để trống.";
    // }

    const res = await UserApi.updateInfo(
      `accounts/updateProfile/${userDetail._id}`,
      {
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }
    );
    if (res.field === "oldPassword") {
      newErrors.oldPassword = true;
      newErrorMessages.oldPassword = "Mật khẩu cũ không đúng.";
    }
    if (res.field === "email") {
      newErrors.email = true;
      newErrorMessages.email = "Email này đã được sử dụng.";
    }
    // Nếu có lỗi, cập nhật trạng thái
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessages(newErrorMessages);
      return;
    }
    dispatch(reloadData(`accounts/reload/${userDetail._id}`));
    // Nếu không có lỗi, tiến hành lưu thông tin
    setErrors({
      email: false,
      oldPassword: false,
      newPassword: false,
    });

    showToast(
      "Lưu thông tin đăng nhập thành công!",
      "Thông tin đăng nhập đã được lưu."
    );
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEmail(userDetail.email);
    setOldPassword("");
    setNewPassword("");
    setErrors({
      email: false,
      oldPassword: false,
      newPassword: false,
    });
    // Logic hủy
    setTimeout(() => {
      setIsEditing(false);
    }, 500);
  };

  const handleFocus = (field) => {
    // Ẩn lỗi cho field khi focus
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
  };

  return (
    <Box
      border="1px"
      borderColor="gray.300"
      borderRadius="lg"
      p={4}
      bg={"white"}
      shadow={"md"}
    >
      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Thông Tin Đăng Nhập
      </Text>

      <FormControl mb={4}>
        <FormLabel fontWeight="bold" fontSize="lg">
          Email
        </FormLabel>
        <Input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => handleFocus("email")} // Ẩn lỗi khi focus
          border={errors.email ? "1px red solid" : "1px black solid"}
          size="lg"
          bg="gray.100"
          _hover={{ bg: "gray.200" }}
          _focus={{ bg: "white", borderColor: "blue.400" }}
          isDisabled={!isEditing} // Disable input nếu không đang sửa
        />
        {errors.email && (
          <Text mt="2px" fontWeight="600" color="red">
            {errorMessages.email}
          </Text>
        )}
      </FormControl>

      <FormControl mb={4}>
        <FormLabel fontWeight="bold" fontSize="lg">
          Mật khẩu cũ
        </FormLabel>
        <Input
          type="password"
          placeholder="Nhập mật khẩu cũ"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          onFocus={() => handleFocus("oldPassword")} // Ẩn lỗi khi focus
          border={errors.oldPassword ? "1px red solid" : "1px black solid"}
          size="lg"
          bg="gray.100"
          _hover={{ bg: "gray.200" }}
          _focus={{ bg: "white", borderColor: "blue.400" }}
          isDisabled={!isEditing} // Disable input nếu không đang sửa
        />
        {errors.oldPassword && (
          <Text mt="2px" fontWeight="600" color="red">
            {errorMessages.oldPassword}
          </Text>
        )}
      </FormControl>

      <FormControl mb={4}>
        <FormLabel fontWeight="bold" fontSize="lg">
          Mật khẩu mới
        </FormLabel>
        <Input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onFocus={() => handleFocus("newPassword")} // Ẩn lỗi khi focus
          border={errors.newPassword ? "1px red solid" : "1px black solid"}
          size="lg"
          bg="gray.100"
          _hover={{ bg: "gray.200" }}
          _focus={{ bg: "white", borderColor: "blue.400" }}
          isDisabled={!isEditing} // Disable input nếu không đang sửa
        />
        {errors.newPassword && (
          <Text mt="2px" fontWeight="600" color="red">
            {errorMessages.newPassword}
          </Text>
        )}
      </FormControl>

      <Flex w={"100%"} justifyContent={!isEditing ? "left " : "center"}>
        {!isEditing ? (
          <Button mt={4}   _hover={{
            bg: "#234ca1",
          }}
          bgColor={"#2d5be4"}
          color={'white'}size="lg" onClick={handleEditClick}>
            Sửa
          </Button>
        ) : (
          <>
            <Button
              mt={4}
              _hover={{
                bg: "#234ca1",
              }}
              bgColor={"#2d5be4"}
              color={'white'}
              size="lg"
              onClick={handleSaveClick}
            >
              Lưu
            </Button>
            <Button
              mt={4}
              ml={4}
              _hover={{
                bg: "#234ca1",
              }}
              bgColor={"#2d5be4"}
              color={'white'}
              size="lg"
              onClick={handleCancelClick}
            >
              Hủy
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default AuthSection;
