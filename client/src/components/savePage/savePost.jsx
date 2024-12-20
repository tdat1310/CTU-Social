import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tag,
  Icon,
} from "@chakra-ui/react";
import { FaImage, FaFile } from "react-icons/fa";
import {
  blogDetailClear,
  reloadDetailBlog,
} from "../../Redux/slices/blogSlice";

const SavePost = ({ post, userDetail, navigate, dispatch }) => {
  // Kiểm tra nếu có ảnh hoặc tệp đính kèm
  const hasImage =
    post.DinhKem && post.DinhKem.some((file) => file.type === "post-pic");
  const hasFile =
    post.DinhKem && post.DinhKem.some((file) => file.type === "post-file");

  return (
    <Card
      variant="outline"
      borderRadius="lg"
      boxShadow="md"
      border="1px solid #DFE0DC"
      transition="all 0.2s"
      display="flex"
      cursor="pointer"
      flexDirection="column"
      height="100%"
      _hover={{
        boxShadow: "lg",
        transform: "scale(1.02)",
      }}
    >
      <CardHeader>
        <Heading size="md">
          {post.TieuDe} {/* Tiêu đề bài viết */}
        </Heading>
        <Box mt={2}>
          {post.Tags.map((tag) => (
            <Tag key={tag} mr={2} colorScheme="blue">
              {tag.TenTag} {/* Hiển thị tag của bài viết */}
            </Tag>
          ))}
        </Box>
      </CardHeader>
      <CardBody flex="1">
        <Text
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: "2", // Giới hạn 2 dòng
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
          }}
          dangerouslySetInnerHTML={{ __html: post.NoiDung }}
        ></Text>

        <Flex mt={2} align="center">
          {hasImage && (
            <Flex align="center" mr={4}>
              <Icon as={FaImage} color="blue.500" boxSize={5} />
              <Text ml={2} color="blue.500" fontWeight="bold">
                Có ảnh
              </Text>
            </Flex>
          )}
          {hasFile && (
            <Flex align="center">
              <Icon as={FaFile} color="blue.500" boxSize={5} />
              <Text ml={2} color="blue.500" fontWeight="bold">
                Có tệp đính kèm
              </Text>
            </Flex>
          )}
        </Flex>
      </CardBody>
      <CardFooter>
        <Button
          bg={"#2e5be0"}
          _hover={{
            bg: "#234ca1",
          }}
          color={"white"}
          onClick={() => {
            dispatch(blogDetailClear());
            dispatch(reloadDetailBlog(`posts/reload/${post._id}`));
            setTimeout(() => {
              const filteredData = userDetail.BaiDang.filter(
                (item) => item._id === post._id
              );
              //  console.log(filteredData)
              const data = filteredData.length > 0;
              data
                ? navigate(`/account/user/post/${post._id}`)
                : navigate(
                    `/account/guest/${post.TaiKhoan_id._id}/post/${post._id}`
                  );
            }, 1000);
          }}
        >
          Đọc thêm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SavePost;
