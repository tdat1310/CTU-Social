import {
  Avatar,
  Box,
  HStack,
  Text,
  useColorModeValue,
  VStack,
  Tooltip,
} from "@chakra-ui/react";

const GroupResult = ({ group, navigate }) => {
  const textColor = useColorModeValue("gray.800", "gray.200");
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      boxShadow="lg"
      w="100%"
      cursor="pointer"
      onClick={() => navigate(`/group/${group._id}`)}
      _hover={{
        bg: useColorModeValue("blue.50", "blue.900"), // Hiệu ứng hover với màu xanh nhạt
        boxShadow: "lg",
        transition: "0.3s",
      }}
      borderLeft="4px solid" // Đường viền bên trái
      borderColor="blue.500"
    >
      <HStack spacing={4} align="center">
        <Avatar
          name={group.TenNhom}
          src={group.coverPic ? group.coverPic.display_url : "/src/assets/no-cover.png"}
          borderRadius={'10px'}
          size="xl"
          borderWidth="2px"
          borderColor={useColorModeValue("gray.300", "gray.600")}
        />
        <VStack align="start" spacing={1}>
          <Tooltip label={group.TenNhom} aria-label="Tên nhóm" placement="top">
            <Text fontWeight="bold" fontSize="lg" color="blue.500" isTruncated maxW="180px">
              {group.TenNhom}
            </Text>
          </Tooltip>
          {group.description && (
            <Text fontSize="sm" color={textColor} noOfLines={1}>
              {group.description}
            </Text>
          )}
          {Array.isArray(group.ThanhVien) && (
            <Text fontSize="sm" color={textColor}>
              {group.ThanhVien.length} Thành Viên
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

export default GroupResult;
