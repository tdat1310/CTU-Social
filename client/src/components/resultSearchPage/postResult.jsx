import {
  Box,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
  Icon,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { FaImage, FaFileAlt } from "react-icons/fa"; // Import biểu tượng từ react-icons
import { useDispatch } from "react-redux";
import { blogDetailClear, reloadDetailBlog } from "../../Redux/slices/blogSlice";

const PostResult = ({ post, navigate, userDetail }) => {
  const dispatch = useDispatch()
  const hasImage =
    post.DinhKem && post.DinhKem.some((file) => file.type === "post-pic");
  const hasFile =
    post.DinhKem && post.DinhKem.some((file) => file.type === "post-file");

  return (
    <Box
      p={6}
      bg={useColorModeValue("white", "gray.800")}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      w="100%"
      cursor="pointer"
      onClick={() => {
        dispatch(blogDetailClear());
        dispatch(reloadDetailBlog(`posts/reload/${post._id}`));
        setTimeout(() => {
          // const filteredData = userDetail.BaiDang.filter(
          //   (item) => item._id === post._id
          // );
          // const data = filteredData.length > 0;
          //  console.log(post)
           userDetail._id  === post.TaiKhoan_id._id
            ? navigate(`/account/user/post/${post._id}`)
            : navigate(`/account/guest/${post.TaiKhoan_id._id}/post/${post._id}`);
        }, 1000);
      }}
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "lg",
        transition: "0.3s",
      }}
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        borderRadius="lg"
        bgGradient="linear(to-r, blue.400, blue.600)"
        opacity={0.1}
      />
      <VStack align="start" spacing={1} position="relative" zIndex={1}>
        <Heading size="md" mb={2} color="blue.600" isTruncated w={"300px"}>
          {post.TieuDe}
        </Heading>
        
        {/* Hiển thị các tags */}
        {post.Tags && post.Tags.length > 0 && (
          <HStack spacing={2} mb={2}>
            {post.Tags.map((tag, index) => (
              <Tag key={index} colorScheme="blue">
                <TagLabel>{tag.TenTag}</TagLabel>
              </Tag>
            ))}
          </HStack>
        )}
        <Box
          as="div"
          style={{
            lineHeight: "1.5rem",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
          color={useColorModeValue("gray.600", "gray.300")}
          dangerouslySetInnerHTML={{ __html: post.NoiDung }}
        />
        <Text
          fontSize="sm"
          color={useColorModeValue("gray.500", "gray.400")}
          mt={2}
          fontStyle="italic"
        >
          Bấm để xem chi tiết...
        </Text>

        <HStack spacing={3} mt={2}>
          {hasImage && (
            <Icon as={FaImage} boxSize={5} color="blue.500" />
          )}
          {hasFile && (
            <Icon as={FaFileAlt} boxSize={5} color="blue.500" />
          )}
        </HStack>

      </VStack>
    </Box>
  );
};

export default PostResult;
