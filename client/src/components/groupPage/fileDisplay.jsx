import {
  Box,
  SimpleGrid,
  Text,
  Flex,
  Image,
  IconButton,
  Tooltip,
  Link,
} from "@chakra-ui/react";
import { FaDownload, FaEye } from "react-icons/fa"; // Import các biểu tượng
import React from "react";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import GetIconByMimeType from "../../utils/GetIconByMimeType";
import {
  blogDetailClear,
  reloadDetailBlog,
} from "../../Redux/slices/blogSlice";
// Hàm xử lý tải về file
const handleDownload = (file) => {
  // Logic để tải về file
  console.log("Downloading:", file);
};

const FileDisplay = ({ files, dispatch, navigate, userDetail, isMember }) => {
  // Hàm xử lý xem chi tiết file
  const handleViewDetails = (file) => {
    dispatch(blogDetailClear());
    dispatch(reloadDetailBlog(`posts/reload/${file.postId}`));
    setTimeout(() => {
      userDetail._id === file.uploadedBy._id
        ? navigate(`/account/user/post/${file.postId}`)
        : navigate(`/account/guest/${file.uploadedBy._id}/post/${file.postId}`);
    }, 1000);
  };
  const getTruncatedFileName = (fileName) => {
    const fileNameParts = fileName.split(".");
    const fileNameWithoutExtension = fileNameParts.slice(0, -1).join(".");
    return fileNameWithoutExtension.length > 20
      ? `${fileNameWithoutExtension.substring(0, 20)}...`
      : fileNameWithoutExtension;
  };

  return (
    <>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        File
      </Text>
      {isMember ? (
        files.length === 0 ? (
          <Flex w={"100%"} justifyContent={"center"}>
            <Image w={"40%"} src="/src/assets/no-file.png" h={"350px"} />
          </Flex>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} w={"100%"} spacing={3}>
            {files.map((file, index) => (
              <Box
                key={index}
                shadow={"md"}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                w={"100%"}
                border="1px solid #DFE0DC"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {<GetIconByMimeType mimeType={file.mimeType} />}
                <Text
                  fontWeight="medium"
                  isTruncated // Thêm thuộc tính này để tự động rút ngắn văn bản
                  maxW="50%" // Giới hạn chiều rộng tối đa của tên file
                >
                  {getTruncatedFileName(file.name)}
                </Text>
                <Flex>
                  <Tooltip label={"Tải xuống"} hasArrow>
                    <Link href={file.url}>
                      <IconButton
                        fontSize={"18px"}
                        aria-label="Download file"
                        icon={<FiDownload />}
                        variant="outline"
                        mr={2}
                      />
                    </Link>
                  </Tooltip>
                  <Tooltip label={"Đi tới bài viết"} hasArrow>
                    <IconButton
                      fontSize={"18px"}
                      aria-label="View details"
                      icon={<FaRegShareFromSquare />}
                      variant="outline"
                      onClick={() => handleViewDetails(file)}
                    />
                  </Tooltip>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        )
      ) : (
        <Text fontSize="lg" color="gray.500" p={3}>
          Bạn không phải là thành viên của nhóm này, nên không thể xem các file.
        </Text>
      )}
    </>
  );
};

export default FileDisplay;
