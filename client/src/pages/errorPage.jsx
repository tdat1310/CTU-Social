import { Box, Center, Text, Link, Flex, Image } from "@chakra-ui/react";
import Brand from "../components/common/brand";

const ErrorPage = () => {
  return (
    <Center h="100vh" bg="gray.80">
      <Box
        p="5"
        maxW="640px"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
      >
        <Brand />
        <Text fontSize="4xl" fontWeight="bold" color="gray.800">
          404 Error
        </Text>
        <Flex justifyContent="center" alignItems="center">
          <Image
            src={"/src/assets/404.png"}
            alt="Không có file nào"
            objectFit="contain"
            height={'400px'}
          />
        </Flex>
        <Text mt={2} fontSize="lg" fontWeight="semibold" color="gray.600">
          Trang không tìm thấy
        </Text>
        <Text mt={2} fontSize="md" color="gray.500">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra lại
          đường dẫn hoặc quay lại trang chủ.
        </Text>
        <Flex justify="center" mt={4}>
          <Link href="/" fontSize="lg" fontWeight="bold" color="blue.600">
            Quay lại trang chủ
          </Link>
        </Flex>
      </Box>
    </Center>
  );
};

export default ErrorPage;
