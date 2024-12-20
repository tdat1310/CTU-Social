import {
  useColorModeValue,
  Box,
  HStack,
  Avatar,
  VStack,
  Text,
  Tooltip,
} from "@chakra-ui/react";

const UserResult = ({ user, userId, navigate }) => (
  <Box
    p={5}
    bg={useColorModeValue("white", "gray.800")}
    borderWidth="1px"
    borderRadius="lg"
     border="1px solid #b8eafc"
    cursor="pointer"
    boxShadow="sm" // Bóng đổ nhẹ
    w="100%"
    // borderColor={useColorModeValue("blue.700", "blue.500")} // Màu viền đậm hơn nữa
    _hover={{
      boxShadow: "md", // Tăng bóng đổ nhẹ khi hover
      transform: "scale(1.02)", // Hiệu ứng phóng to nhẹ
      transition: "0.2s", // Thời gian chuyển tiếp
    }}
    position="relative"
    onClick={() => {
      if (user._id === userId) navigate("/account/user");
      else navigate(`/account/guest/${user._id}`);
    }}
  >
    {/* Nền với hiệu ứng gradient động */}
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      background="linear-gradient(135deg, rgba(0, 150, 255, 0.1), rgba(0, 200, 255, 0.1))" // Gradient xanh
      borderRadius="lg"
      zIndex={0} // Đặt nền phía dưới
      filter="blur(8px)" // Làm mờ nền
    />
    <HStack spacing={4} position="relative" zIndex={1}>
      <Avatar
        name={user.userName}
        src={user.avtPic ? user.avtPic.display_url : "/src/assets/no-avt.png"}
        size="lg"
        border="3px solid" // Viền cho Avatar
        borderColor="blue.600" // Viền màu xanh đậm
        boxShadow="sm" // Bóng đổ nhẹ cho Avatar
        transition="transform 0.2s" // Hiệu ứng chuyển tiếp cho Avatar
        _hover={{ transform: "scale(1.05)" }} // Phóng to Avatar khi hover
      />
      <VStack align="start">
        <Text fontWeight="bold" fontSize="lg" color="blue.600" isTruncated>
          {user.userName}
        </Text>

        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
          Nhấp để xem hồ sơ
        </Text>
      </VStack>
    </HStack>
  </Box>
);

export default UserResult;
