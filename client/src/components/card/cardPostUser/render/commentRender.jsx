import { Box, Button, Skeleton, Stack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  blogDetailClear,
  reloadDetailBlog,
} from "../../../../Redux/slices/blogSlice";
import Comment from "../../../common/comment";

const CommentRender = ({
  blogData,
  user_id,
  setProgress,
  userInteract,
  setLoading,
  loading,
  feed,
  tag,
  tagPost,
  group,
  groupAll
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    //  console.log(blogData)
    return () => clearTimeout(timer);
  }, [loading, setLoading]);

  return loading ? (
    // Display skeletons while loading
    <Stack>
      <Skeleton height="50px" />
      <Skeleton height="50px" />
      <Skeleton height="50px" />
    </Stack>
  ) : (
    // Display comments after loading
    blogData.comments.slice(0, 3).map((comment, index) => (
      <Box key={index}>
        <Comment
          comment={comment}
          ownerId={user_id}
          userInteractId={userInteract._id}
          dispatch={dispatch}
          post_id={blogData.post_id}
          detail={false}
          feed={feed}
          tag={tag}
          group={group}
          groupAll={groupAll}
          tagPost={tagPost}
        />
        {index === 2 && blogData.comments.length > 3 && (
          <Box position="relative" m="10px">
            <Button
              colorScheme="blue"
              w="100px"
              m="0 auto"
              size="sm"
              zIndex={1}
              ml={"-20px"}
              variant={"link"}
              onClick={() => {
                setProgress(20);
                dispatch(blogDetailClear());
                dispatch(reloadDetailBlog(`posts/reload/${blogData.post_id}`));
                setTimeout(() => {
                  setProgress(100);
                  userInteract._id  === blogData.ownerPost
                    ? navigate(`/account/user/post/${blogData.post_id}`)
                    : navigate(
                        `/account/guest/${user_id}/post/${blogData.post_id}`
                      );
                }, 1000);
              }}
            >
              Xem thêm
            </Button>
            <Box
              w="105.7%"
              h="60px"
              position="absolute"
              top="-20px"
              left={"-19.7px"}
              bgGradient="linear(to-b, rgba(128, 128, 128, 0), rgba(128, 128, 128, 0.23))"
              pointerEvents="none"
              borderBottom="1px solid #DFE0DC"
            />
          </Box>
        )}
      </Box>
    ))
  );
};

export default CommentRender;
