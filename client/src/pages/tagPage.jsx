/* eslint-disable react-hooks/exhaustive-deps */
import {
  Flex,
  VStack,
  Text,
  Box,
  Spinner,
  Button,
  Progress,
  useDisclosure,
} from "@chakra-ui/react";
import Header from "../components/common/header";
import ModalCustom from "../components/Modal/modalCustom";
import { PiTagSimpleFill } from "react-icons/pi";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostByTagId } from "../Redux/slices/tagSlice";
import { useParams } from "react-router-dom";
import CardPostUser from "../components/card/cardPostUser/cardPostUser";
import BlogApi from "../apis/blogApi";
import { reloadData } from "../Redux/slices/authSlice";

const TagPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [post, setPost] = useState(3);
  const { tag_id, tag_name } = useParams();
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

  const scrollContainerRef = useRef(null);
  const postsByTag = useSelector((state) => state.tag.postByTag);
  const totalPosts = useSelector((state) => state.tag.totalPosts);
  const tenTag = useSelector((state) => state.tag.tenTag); // Lấy tenTag từ state
  const userDetail = useSelector((state) => state.auth.userDetail); // Lấy userDetail từ state
  const [isFollowing, setIsFollowing] = useState(() => {
    // Kiểm tra xem userDetail.Tags có chứa tag có TenTag trùng với tenTag không
    return userDetail?.TagFollow?.some((tag) => tag.TenTag === tag_name) || false;
  });

  const handleFollow = async () => {
    if (!isFollowing) {
      await BlogApi.followTag("posts/follow/tag", {
        userId: userDetail._id,
        tag_id: tag_id,
      });
      setIsFollowing(true);
    } else {
      await BlogApi.unFollowTag("posts/unFollow/tag", {
        userId: userDetail._id,
        tag_id: tag_id,
      });
      setIsFollowing(false);
    }
    setTimeout(() => {
      dispatch(reloadData(`accounts/reload/${userDetail?._id}`));
    }, 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, tag_id]);

  useEffect(() => {
    setIsFetching(true);
    dispatch(getAllPostByTagId(`posts/postByTag/${tag_id}?post=${post}`));
    const timer = setTimeout(() => {
      setIsFetching(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [post]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    if (scrollTop + clientHeight >= scrollHeight) {
      console.log(totalPosts, postsByTag.length);
      if (totalPosts !== postsByTag.length) {
        if (totalPosts - postsByTag.length >= 3) {
          setPost((prevPost) => prevPost + 3);
        }
        if (
          totalPosts - postsByTag.length < 3 ||
          totalPosts - postsByTag.length > 0
        ) {
          setPost((prevPost) => prevPost + totalPosts - postsByTag.length);
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
  }, [isFetching, postsByTag]);

  return (
    <>
      {progress > 0 && progress < 100 ? (
        <Progress
          value={60}
          size="sm"
          position="sticky"
          top={0}
          zIndex={100}
          isIndeterminate
        />
      ) : (
        ""
      )}
      <VStack w={"100%"} ref={scrollContainerRef} overflowY="auto" h="100vh">
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
            <VStack w={"50%"} m={"0 auto"} mt={"10px"} p={4}>
              <Flex
                w={"100%"}
                alignItems={"center"}
                border="1px solid #eeeeee"
                shadow={"md"}
               
                p={"4px 10px"}
                borderRadius={"10px"}
                justifyContent={"space-between"}
              >
                <Flex flexDirection={'column'} padding={2}>
                <Flex alignItems={"center"} gap={"5px"}>
                  {/* <Box fontSize={"35px"} color={"#2e81d6"} mt={"2px"}>
                    <PiTagSimpleFill />
                  </Box> */}
                  <Text
                    fontSize={"50px"}
                    fontWeight={"700"}
                    color={"#2e81d6"}
                    mt={"-5px"}
                  >
                    #
                  </Text>
                  <Text fontSize={"35px"} fontWeight={"700"} color={"#2d5be4"}>
                    {tenTag}
                  </Text>
                </Flex>
                  <Text  fontSize={"25px"} color={'#718097'}> Có {totalPosts} bài viết</Text>
                </Flex>
                <Button
                 bgColor={isFollowing ? "#2d5be4" : "#2d74e4"}
                 _hover={{
                   bgColor: isFollowing ? "#234ca1" : "#1e5db8",
                 }}
                 
                  color={"white"}
                
                  
                  transition={"0.5s"}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Đã lưu" : "Lưu"}
                </Button>
              </Flex>
              {/* List các post */}
              <VStack w={"100%"} spacing={"20px"}>
                {postsByTag.map((blogData, index) => (
                  <VStack key={index} w={"100%"}>
                    <CardPostUser
                      blogData={blogData}
                      userDetail={blogData.TaiKhoan_id}
                      post_id={blogData.post_id}
                      setProgress={setProgress}
                      feed={false}
                      tag={true}
                      tagPost={post}
                    />
                  </VStack>
                ))}
              </VStack>
              {/* Thẻ ẩn cuối trang */}
              <Box w={"100%"} h={"10px"} />
              {isFetching && ( // Hiển thị Spinner khi đang tải thêm dữ liệu
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
          </>
        )}
      </VStack>
    </>
  );
};

export default TagPage;

