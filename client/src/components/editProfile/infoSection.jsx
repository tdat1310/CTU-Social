import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { reloadData } from "../../Redux/slices/authSlice";
import { UserApi } from "../../apis/userApi";

const majors = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "Hệ thống thông tin",
  "Khoa học máy tính",
  // Thêm các ngành khác của Đại học Cần Thơ ở đây
];

const years = [
  "Khóa 44 (2018-2022)",
  "Khóa 45 (2019-2023)",
  "Khóa 46 (2020-2024)",
  "Khóa 47 (2021-2025)",
  "Khóa 48 (2022-2026)",
  "Khóa 49 (2022-2026)",
  "Khóa 50 (2022-2026)",
  // Thêm các khóa khác ở đây
];

const InfoSection = ({
  setName,
  setMajor,
  setYear,
  major,
  year,
  name,
  showToast,
  userDetail,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const dispatch = useDispatch();
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    // Kiểm tra nếu tên bị bỏ trống
    if (!name.trim()) {
      setError(true);
      setErrorContent("Tên không được để trống.");
      return; // Dừng lại nếu có lỗi
    }
    const res = await UserApi.updateInfo(
      `accounts/updateProfile/${userDetail._id}`,
      {
        userName: name,
        ChuyenNganh: major,
        Khoa: year,
      }
    );
    if (res.field === "userName") {
      setError(true);
      setErrorContent("Tên người dùng bị trùng");
      return; // Dừng lại nếu có lỗi
    }
    // Nếu không có lỗi, tiến hành lưu thông tin
    dispatch(reloadData(`accounts/reload/${userDetail._id}`));
    setError(false);
    showToast(
      "Lưu thông tin cá nhân thành công!",
      "Thông tin cá nhân đã được lưu."
    );
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setName(userDetail.userName);
    setError(false);
    setTimeout(() => {
      setIsEditing(false);
    }, 500);
    // Logic hủy
  };

  const handleFocus = () => {
    // Khi focus vào input, ẩn lỗi
    setError(false);
  };

  return (
    <Box
      border="1px"
      borderColor="gray.300"
      borderRadius="lg"
      p={4}
      mb={4}
      bg={"white"}
      shadow={"md"}
    >
      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Thông Tin Cá Nhân
      </Text>

      <FormControl mb={4}>
        <FormLabel fontWeight="bold" fontSize="lg">
          Tên
        </FormLabel>
        <Input
          type="text"
          border={error ? "1px red solid" : "1px black solid"}
          placeholder="Nhập tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={handleFocus} // Ẩn lỗi khi focus
          size="lg"
          bg="gray.100"
          _hover={{ bg: "gray.200" }}
          _focus={{ bg: "white", borderColor: "blue.400" }}
          isDisabled={!isEditing}
        />
        {error && (
          <Text mt={"2px"} fontWeight={"600"} color={"red"}>
            {errorContent}
          </Text>
        )}
      </FormControl>

      <FormControl mb={4}>
        <FormLabel fontWeight="bold" fontSize="lg">
          Chuyên ngành
        </FormLabel>
        <Select
          placeholder="Chọn chuyên ngành"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          size="lg"
          bg="gray.100"
          _hover={{ bg: "gray.200" }}
          _focus={{ bg: "white", borderColor: "blue.400" }}
          isDisabled={!isEditing}
        >
          {majors.map((majorOption, index) => (
            <option key={index} value={majorOption}>
              {majorOption}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel fontWeight="bold" fontSize="lg">
          Khóa
        </FormLabel>
        <Select
          placeholder="Chọn khóa"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          size="lg"
          bg="gray.100"
          _hover={{ bg: "gray.200" }}
          _focus={{ bg: "white", borderColor: "blue.400" }}
          isDisabled={!isEditing}
        >
          {years.map((yearOption, index) => (
            <option key={index} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </Select>
      </FormControl>

      <Flex w={"100%"} justifyContent={!isEditing ? "left " : "center"}>
        {!isEditing ? (
          <Button
            mt={4}
            _hover={{
              bg: "#234ca1",
            }}
            bgColor={"#2d5be4"}
            color={"white"}
            size="lg"
            onClick={handleEditClick}
          >
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

export default InfoSection;
