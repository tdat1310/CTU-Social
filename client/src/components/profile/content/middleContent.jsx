/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from "react"; 
import { Box, VStack, Flex, Spinner } from "@chakra-ui/react";
import CardPostUser from "../../card/cardPostUser/cardPostUser";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DataFormat from "../../../utils/dataFormat";
import { loadAllBlog } from "../../../Redux/slices/blogSlice";

const MiddleContent = memo(({ setProgress, setReload, scrollContainerRef }) => {
  const [post, setPost] = useState(3);
  const [isFetching, setIsFetching] = useState(false);
  const userInfo = useSelector((state) => state.auth.userDetail);
  const allBlogs = useSelector((state) => state.blog.allPost);
  const totalPost = useSelector((state) => state.blog.totalPost);
  const userDetail = useSelector((state) => state.blog.userDetail);
  const params = useParams();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const userId = params.role === "user" ? userInfo._id : params.user_id;
  //   dispatch(loadAllBlog(`accounts/${userId}?post=${post}`));
  // }, [params.role, post]);

  useEffect(() => {
    const userId = params.role === "user" ? userInfo._id : params.user_id;
    setIsFetching(true);
    dispatch(loadAllBlog(`accounts/${userId}?post=${post}`));
    const timer = setTimeout(() => {
      setIsFetching(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [post, params.role]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight ) {

        console.log(totalPost, allBlogs.length);
        if (totalPost > allBlogs.length) {
          const remainingPosts = totalPost - allBlogs.length;
          setPost((prevPost) => prevPost + Math.min(remainingPosts, 3));
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
  }, [allBlogs]);

  // Sắp xếp các bài viết theo createTime từ mới đến cũ
  const transformedBlogs = allBlogs
    ? allBlogs
        .map((blog) => DataFormat(blog))
        .sort((a, b) => new Date(b.createTime) - new Date(a.createTime)) // Sắp xếp theo createTime
    : [];
  // console.log(transformedBlogs)
  return (
    <Box color="white" p={4}>
      <VStack w={"100%"} spacing={"20px"}>
        {transformedBlogs.map((blogData, index) => (
          <VStack key={index} w={"100%"}>
            <CardPostUser
              blogData={blogData}
              userDetail={userDetail}
              post_id={blogData.post_id}
              setProgress={setProgress}
              setReload={setReload}
              feed={false}
              tag={false}
              tagPost={post}
            />
          </VStack>
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
    </Box>
  );
});

// Thêm displayName cho component
MiddleContent.displayName = "MiddleContent";

export default MiddleContent;
