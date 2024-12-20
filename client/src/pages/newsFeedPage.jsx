/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Input,
  VStack,
  Text,
  Progress,
  Spinner,
  useDisclosure,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Header from "../components/common/header";
import ListSection from "../components/newsfeed/listSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchGlobalData, getUserRecommend } from "../Redux/slices/globalSlice";
import DataFormat from "../utils/dataFormat";
import CardPostUser from "../components/card/cardPostUser/cardPostUser";
import { BiNews } from "react-icons/bi";
import ModalCustom from "../components/Modal/modalCustom";
import Sidebar from "../components/newsfeed/sideBar";

const NewsFeedPage = React.memo(() => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [post, setPost] = useState(3);
  const [loading, setLoading] = useState(true);
  const [sortedBlogs, setSortedBlogs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const userDetail = useSelector((state) => state.auth.userDetail);
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const scrollContainerRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const allPost = useSelector((state) => state.global.posts);
  const userRecommend = useSelector((state) => state.global.userRecommend);
  const tags = useSelector((state) => state.global.tags);
  const totalPost = useSelector((state) => state.global.totalPost).length;

  useEffect(() => {
    setIsFetching(true);
    dispatch(fetchGlobalData(`infos/globalData?post=${post}`));
    dispatch(getUserRecommend(`infos/get/userRcm/${userDetail._id}`));
    const timer = setTimeout(() => {
      setIsFetching(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [post]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (allPost) {
      const transformedBlogs = allPost.map((post) => DataFormat(post));
      let sortedData = [...transformedBlogs];

      if (sortOption === "newest") {
        sortedData.sort(
          (a, b) => new Date(b.createTime) - new Date(a.createTime)
        );
      } else if (sortOption === "oldest") {
        sortedData.sort(
          (a, b) => new Date(a.createTime) - new Date(b.createTime)
        );
      } else if (sortOption === "mostLiked") {
        sortedData.sort((a, b) => b.likeNum - a.likeNum);
      }

      setSortedBlogs(sortedData);
    }
  }, [allPost, sortOption]);

  const handleSort = (option) => {
    setSortOption(option);
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
      
      // console.log(scrollTop,clientHeight, scrollHeight);
    if (scrollTop + clientHeight >= scrollHeight - 1) {
console.log(totalPost, allPost.length);
      if (totalPost !== allPost.length) {
        if (totalPost - allPost.length >= 3) {
          setPost((prevPost) => prevPost + 3);
        } else if (totalPost - allPost.length > 0) {
          setPost((prevPost) => prevPost + totalPost - allPost.length);
        }
      }
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [allPost]);

  return (
    <>
      {progress > 0 && progress < 100 && (
        <Progress
          value={progress}
          size="sm"
          position="sticky"
          top={0}
          zIndex={100}
          isIndeterminate
        />
      )}
      <VStack
        w={"100%"}
        ref={scrollContainerRef}
        overflowY="auto"
        h="100vh"
        bg={"#eff4fa"}
        gap={"0"}
      >
        {loading ? (
          <Flex align="center" justify="center" h="100vh">
            <Spinner
              size="xl"
              emptyColor="gray.200"
              thickness="5px"
              speed="0.65s"
              color="blue.500"
            />
          </Flex>
        ) : (
          <>
            <Header />
            <Flex w="100%" pr={5} justify="space-between" >
              <Flex
                gap={"0"}
                position="sticky"
                h={"86vh"}
                top={"14%"}
                borderTop={"1px #2a86d5 solid"}
              >
                <Sidebar userDetail={userDetail} />
              </Flex>
              <Flex w={"100%"} p={4}>
                <VStack w="80%" gap={"10px"}>
                  <Flex
                    gap={"10px"}
                    w={"71%"}
                    flexDirection={"column"}
                    align={"flex-start"}
                  >
                    <Flex
                      fontSize={"28px"}
                      fontWeight={"700"}
                      w={"300px"}
                      textAlign={"left"}
                      gap={"10px"}
                      mb={4}
                    >
                      <Box mt={"7px"}>
                        <BiNews />
                      </Box>
                      <Text>Bảng tin</Text>
                    </Flex>
                    <Box w={"100%"}>
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                          bg={"white"}
                          border="1px solid #DFE0DC"
                          shadow={"md"}
                        >
                          Sắp xếp
                        </MenuButton>
                        <MenuList border="1px solid #DFE0DC" shadow={"md"} zIndex={'99'}>
                          <MenuItem onClick={() => handleSort("newest")}>
                            Mới nhất
                          </MenuItem>
                          <MenuItem onClick={() => handleSort("oldest")}>
                            Cũ nhất
                          </MenuItem>
                          <MenuItem onClick={() => handleSort("mostLiked")}>
                            Nhiều lượt thích nhất
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                  </Flex>
                  <Flex
                    align="center"
                    p={4}
                    bg="linear-gradient(to right, #2d5be4 0%, #ecf2f7 100%)"
                    borderRadius="20px"
                    overflow={"hidden"}
                    mb={4}
                    cursor="pointer"
                    onClick={onOpen}
                    shadow="md"
                    w={"71%"}
                    m={"0 auto"}
                    transition={"0.2s"}
                    _hover={{ transform: "scale(1.02)" }}
                  >
                    <Avatar
                      size="md"
                      name="User Name"
                      src={
                        userDetail.avtPic ? userDetail.avtPic.display_url : ""
                      }
                    />
                    <Input
                      ml={4}
                      placeholder="Bạn đang nghĩ gì?.."
                      isReadOnly
                      bg="white"
                      border="none"
                      _placeholder={{
                        fontWeight: '500'
                      }}
                      _focus={{ border: "none" }}
                      cursor={"pointer"}
                    />
                  </Flex>

                  <VStack w={"80%"} spacing={"20px"}  >
                    {sortedBlogs.map((blogData, index) => (
                      <CardPostUser
                        key={index}
                        blogData={blogData}
                        userDetail={blogData.TaiKhoan_id}
                        post_id={blogData.post_id}
                        setProgress={setProgress}
                        feed={true}
                        tag={false}
                        tagPost={post}
                      />
                    ))}
                    <Box w={"100%"} h={"10px"} />
                    {isFetching && (
                      <Flex w={"100%"} justify="center" py={4}>
                        <Spinner
                          size="lg"
                          emptyColor="gray.200"
                          thickness="4px"
                          speed="0.65s"
                          color="blue.500"
                        />
                      </Flex>
                    )}
                  </VStack>
                </VStack>

                <VStack
                  w="30%"
                  gap={"10px"}
                  p={4}
                  borderRadius="20px"
                  position="sticky"
                  h={"500px"}
                  top={"15%"}
                >
               
                  <ListSection
                    title="Có thể biết"
                    items={userRecommend}
                    LeftSection={true}
                    type={"follow"}
                  />
                  <ListSection
                    title="Các tag phổ biến"
                    items={tags}
                    LeftSection={true}
                    type={"tag"}
                  />
                </VStack>
              </Flex>
            </Flex>
          </>
        )}
      </VStack>

      <ModalCustom
        isModalOpen={isModalOpen}
        onClose={onClose}
        title="Đăng bài viết mới"
        size={"3xl"}
        actionText={"Đăng"}
      />
    </>
  );
});

NewsFeedPage.displayName = "NewsFeedPage";

export default NewsFeedPage;
