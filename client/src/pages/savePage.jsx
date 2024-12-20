import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tag,
  useColorMode,
  VStack,
  Spinner,
  Icon,
  Center,
  Image,
} from "@chakra-ui/react";
import { FaImage, FaFile } from "react-icons/fa"; // Import biểu tượng từ react-icons
import Header from "../components/common/header"; // Import Header cho phần giao diện chung của trang
import SavePost from "../components/savePage/savePost";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SavePage = () => {
  const { colorMode } = useColorMode(); // Sử dụng Color Mode để thay đổi giao diện sáng/tối
  const [showPosts, setShowPosts] = useState(false); // Trạng thái để điều khiển hiển thị bài viết hay tag
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const userDetail = useSelector((state) => state.auth.userDetail);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Dữ liệu bài viết đã lưu

  // Hiệu ứng tải trang trong 1 giây
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Hết thời gian tải sẽ ẩn loading
    return () => clearTimeout(timer); // Xóa timer khi component bị hủy
  }, []);

  return (
    <VStack>
      <Header /> {/* Hiển thị Header */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        // h="100vh"
        p={5}
        w="100%"
      >
        {/* Điều khiển nút chuyển đổi giữa Bài Viết và Tag */}
        <Flex align="center" mb={6}>
          <Button
            _hover={{
              bg: "#234ca1",
              color: "white",
            }}
            bgColor={showPosts ? "#2d5be4" : "#eaf1f9"}
            color={!showPosts ? "black" : "white"}
            onClick={() => setShowPosts(true)}
            mr={3}
            flex="1"
          >
            Bài Viết Đã Lưu
          </Button>
          <Button
            // colorScheme={!showPosts ? "blue" : "gray"}
            _hover={{
              bg: "#234ca1",
              color: "white",
            }}
            bgColor={!showPosts ? "#2d5be4" : "#eaf1f9"}
            color={showPosts ? "black" : "white"}
            onClick={() => setShowPosts(false)}
            flex="1"
          >
            Tag Đã Lưu
          </Button>
        </Flex>

        {/* Hiển thị Spinner khi đang tải dữ liệu */}
        {isLoading ? (
          <Box mt={"15%"}>
            <Spinner color="blue.500" size="xl" />
          </Box>
        ) : (
          <>
            {/* Tiêu đề cố định của phần nội dung */}
            <Box height="60px" display="flex" alignItems="center">
              <Heading
                as="h1"
                size="lg"
                color={colorMode === "light" ? "#2d5be4" : "blue.300"}
              >
                {showPosts ? "Bài Viết Đã Lưu" : "Tag Đã Lưu"}
              </Heading>
            </Box>

            {/* Hiển thị bài viết hoặc tag đã lưu */}
            <SimpleGrid spacing={6} width="100%" maxW="1200px">
              {showPosts ? (
                userDetail.SavedPosts.length !== 0 ? (
                  userDetail.SavedPosts.map((post) => (
                    <SavePost
                      key={post._id}
                      post={post}
                      userDetail={userDetail}
                      navigate={navigate}
                      dispatch={dispatch}
                    />
                  ))
                ) : (
                  <Flex w={"100%"} justifyContent={"center"}>
                    <Image
                      objectFit={"contain"}
                      h={"400px"}
                      src="/src/assets/no-save.png"
                    />
                  </Flex>
                )
              ) : userDetail.TagFollow ? (
                userDetail.TagFollow.map((tag) => (
                  <Card
                    key={tag._id}
                    variant="outline"
                    borderRadius="lg"
                    boxShadow="md"
                    transition="all 0.2s"
                    border="1px solid #DFE0DC"
                    display="flex"
                    flexDirection="column"
                    cursor="pointer"
                    height="100%"
                    _hover={{
                      boxShadow: "lg",
                      transform: "scale(1.02)",
                    }}
                  >
                    <CardHeader>
                      <Heading
                        size="lg"
                        color={colorMode === "light" ? "blue.800" : "white"}
                      >
                        #{tag.TenTag} {/* Tên tag */}
                      </Heading>
                      <Text
                        fontSize="lg"
                        color={colorMode === "light" ? "gray.600" : "gray.400"}
                      >
                        {tag.baiDang_id.length} bài viết{" "}
                        {/* Số lượng bài viết của tag */}
                      </Text>
                    </CardHeader>
                    <CardFooter>
                      <Button
                        bg={"#2e5be0"}
                        _hover={{
                          bg: "#234ca1",
                        }}
                        color={"white"}
                        onClick={() => {
                          navigate(`/tags/${tag.TenTag}/${tag._id}`);
                        }}
                      >
                        Xem Bài Viết
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Flex w={"100%"} justifyContent={"center"}>
                  <Image
                    objectFit={"contain"}
                    h={"400px"}
                    src="/src/assets/no-save.png"
                  />
                </Flex>
              )}
            </SimpleGrid>
          </>
        )}
      </Flex>
    </VStack>
  );
};

export default SavePage;
