/* eslint-disable react-hooks/exhaustive-deps */
import {
  VStack,
  Grid,
  Box,
  Text,
  Spinner,
  Center,
  useToast, // Import useToast
  Flex,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/common/header";
import CreateGroupModal from "../components/Modal/createGroupModal";
import ListGroup from "../components/groupPage/listGroup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPosttTypeGroup,
  fetchGroups,
} from "../Redux/slices/groupSlice"; // Xóa fetchPosts
import DataFormat from "../utils/dataFormat";
import CardPostUser from "../components/card/cardPostUser/cardPostUser";

const GroupPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const userGroups = useSelector((state) => state.group.groups);
  const userDetail = useSelector((state) => state.auth.userDetail);
  const dispatch = useDispatch();
  const toast = useToast(); // Initialize useToast
  const [progress, setProgress] = useState(0);
  const [post, setPost] = useState(3);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const allPost = useSelector((state) => state.group.allPostTypeGroup) ||  [];
  const totalPost = useSelector((state) => state.group.totalPostsTypeGroup)
  // Hàm để hiển thị toast
  const showToast = (status, title, description) => {
    toast({
      title: title,
      description: description,
      status: status, // "success", "error", "warning", "info"
      duration: 5000,
      isClosable: true,
      position: "top", // Có thể thay đổi vị trí toast
    });
  };

  // Mock data cho bài viết
  const mockPosts = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    title: `Bài viết ${index + 1}`,
    content: `Nội dung của bài viết ${
      index + 1
    }. Đây là một đoạn văn mẫu để mô phỏng nội dung bài viết trong ứng dụng.`,
  }));

  useEffect(() => {
    // Fetch groups data
    dispatch(
      fetchGroups({
        url: `groups/get/group/${userDetail._id}`,
      })
    );
    dispatch(
      fetchAllPosttTypeGroup(`groups/get/postTypeGroup/${userDetail._id}?post=${post}`)
    );
    setTimeout(() => {
      setIsLoadingGroups(false);
    }, 500);

    setTimeout(() => {
      setIsLoadingPosts(false);
    }, 1000);
  }, [dispatch]);

  const handleCreateGroup = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    // Lấy dữ liệu khi component được mount
    setIsFetching(true);
    dispatch(
      fetchAllPosttTypeGroup(`groups/get/postTypeGroup/${userDetail._id}?post=${post}`)
    );
    const timer = setTimeout(() => {
      setIsFetching(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [post]);
  const transformedBlogs = allPost.map((post) => DataFormat(post));
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =  scrollContainerRef.current;
    console.log({ scrollTop, scrollHeight, clientHeight }); 
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      console.log(totalPost, allPost.length);
      if (totalPost !== allPost.length) {
        if (totalPost - allPost.length >= 3) {
          setPost((prevPost) => prevPost + 3);
        }
        if (totalPost - allPost.length < 3 || totalPost - allPost.length > 0) {
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
    <VStack w={"100%"} spacing={4}>
      <Header />

      {isLoadingGroups ? (
        <Center h="400px" w="100%">
          <Spinner
            size="lg"
            emptyColor="gray.200"
            thickness="4px"
            speed="0.65s"
            color="blue.500"
          />
        </Center>
      ) : (
        <Grid templateColumns="2fr 8fr" gap={4} w={"97%"} margin={"0 auto"}>
          <ListGroup
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            userGroups={userGroups}
            handleCreateGroup={handleCreateGroup}
          />
          <VStack
            bg="gray.200"
            h="full"
            p={4}
            spacing={4}
            m={'0 auto'}
            overflowY="auto"
            maxH="600px"
            w="100%"
            ref={scrollContainerRef}
          >
            <Box fontWeight="bold" fontSize="lg" textAlign={'left'} w={'100%'}>
              Danh sách bài viết
            </Box>

            {isLoadingPosts ? (
              <Center w="100%" h="100%">
                <Spinner
                  size="lg"
                  emptyColor="gray.200"
                  thickness="4px"
                  speed="0.65s"
                  color="blue.500"
                />
              </Center>
            ) : (
              <VStack w={'90%'}>
               {transformedBlogs.map((blogData, index) => (
                    <CardPostUser
                      key={index}
                      blogData={blogData}
                      userDetail={blogData.TaiKhoan_id}
                      post_id={blogData.post_id}
                      setProgress={setProgress}
                      feed={false}
                      tag={false}
                      group={false}
                      groupAll={true}
                      tagPost={post}
                    />
                  ))}

                {/* Add spacing box */}
                <Box w={"100%"} h={"10px"} />

                {/* Loading spinner when fetching additional posts */}
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
            )}
          </VStack>
        </Grid>
      )}

      <CreateGroupModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        showToast={showToast}
        create={true}
      />
    </VStack>
  );
};

export default GroupPage;
