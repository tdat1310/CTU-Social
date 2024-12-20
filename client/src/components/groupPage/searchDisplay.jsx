/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Flex,
  Text,
  Avatar,
  Tag,
  TagLabel,
  Image,
  Icon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi"; // Icon cho file
import { PiImageBold } from "react-icons/pi"; // Icon cho hình ảnh
import React, { useState, useEffect } from "react";
import {
  blogDetailClear,
  reloadDetailBlog,
} from "../../Redux/slices/blogSlice";

const SearchDisplay = ({
  isSearching,
  searchResults,
  loading,
  userDetail,
  dispatch,
  navigate,
}) => {
  if (!isSearching) {
    // Nếu chưa tìm kiếm
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={10}
        w={"100%"}
        p={4}
      >
        <Text fontSize="xl" fontWeight="bold" color="gray.600" mb={2}>
          Chào mừng bạn đến với trang tìm kiếm
        </Text>
        <Text fontSize="md" color="gray.500">
          Hãy nhập từ khóa để bắt đầu tìm kiếm nội dung.
        </Text>
        <Image
          src="/src/assets/search.png"
          alt="Hình ảnh mặc định"
          w={"50%"}
          borderRadius="lg"
        />
      </Flex>
    );
  }

  return (
    <Flex
      w={"100%"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      p={4}
    >
      {loading ? ( // Hiển thị spinner khi đang tải
        <Center h={"300px"} m={"0 auto"}>
          <Spinner size="xl" />
        </Center>
      ) : searchResults.length > 0 ? (
        searchResults.map((searchResult) => (
          <Box
            key={searchResult._id}
            w={"80%"}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            mb={4}
            border="1px solid #DFE0DC"
            boxShadow="md"
          >
            <Flex
              alignItems="center"
              mb={2}
              cursor={"pointer"}
              onClick={() => {
                if (searchResult.TaiKhoan_id._id === userDetail._id) {
                  navigate("/account/user");
                } else {
                  navigate(`/account/guest/${searchResult.TaiKhoan_id._id}`);
                }
              }}
            >
              <Avatar
                src={searchResult.TaiKhoan_id.avtPic.display_url}
                mr={3}
              />
              <Text
                fontWeight="bold"
                _hover={{
                  transform: "scale(1.04)",
                }}
              >
                {searchResult.TaiKhoan_id.userName}
              </Text>
            </Flex>
            <Box
              w={"100%"}
              cursor={"pointer"}
              onClick={() => {
                dispatch(blogDetailClear());
                dispatch(reloadDetailBlog(`posts/reload/${searchResult._id}`));
                setTimeout(() => {
                  userDetail._id === searchResult.TaiKhoan_id._id
                    ? navigate(`/account/user/post/${searchResult._id}`)
                    : navigate(
                        `/account/guest/${searchResult.TaiKhoan_id._id}/post/${searchResult._id}`
                      );
                }, 1000);
              }}
            >
              <Text fontWeight="bold" fontSize="xl" mb={2}>
                {searchResult.TieuDe}
              </Text>
              <Flex mb={2}>
                {searchResult.Tags.length > 0 ? (
                  searchResult.Tags.map((tag) => (
                    <Tag key={tag._id} mr={2} border="1px solid #DFE0DC">
                      <TagLabel>{tag.TenTag}</TagLabel>
                    </Tag>
                  ))
                ) : (
                  <Text fontStyle="italic" color="gray.500">
                    Không có tag nào.
                  </Text>
                )}
              </Flex>
              <Box
                maxW="400px"
                w="100%"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                dangerouslySetInnerHTML={{ __html: searchResult.NoiDung }}
              />
              <Flex mt={2} alignItems="center">
                {searchResult.DinhKem?.some(
                  (item) => item.type === "post-pic"
                ) && <Icon as={PiImageBold} mr={4} boxSize={9} />}
                {searchResult.DinhKem?.some(
                  (item) => item.type === "post-file"
                ) && <Icon as={FiFile} boxSize={7} />}
              </Flex>
            </Box>
          </Box>
        ))
      ) : (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={10}
          h={"300px"}
        >
          <Text fontSize="xl" fontWeight="bold" color="gray.600" mb={2}>
            Không tìm thấy kết quả nào
          </Text>
          <Text fontSize="md" color="gray.500">
            Hãy thử nhập từ khóa khác để tìm kiếm nội dung phù hợp hơn.
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default SearchDisplay;
