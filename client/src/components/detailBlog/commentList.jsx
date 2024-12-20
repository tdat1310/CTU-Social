import {
  Box,
  Text,
  VStack,
  FormControl,
  Input,
  Card,
  Flex,
  Button,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";
import Comment from "../common/comment";
import { SocketContext } from "../../provider/socketContext";
import { useDispatch } from "react-redux";
import { loadAllBlog, reloadDetailBlog } from "../../Redux/slices/blogSlice";
import { LuSendHorizonal } from "react-icons/lu";
import { BiSolidSend } from "react-icons/bi";
const CommentList = ({ comments, userInteract, post_id, userDetail }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for comments
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate a 1-second loading delay for initial comments load
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const commentHandle = async () => {
    setLoading(true); // Trigger loading state for skeleton
    socket.emit("commentBlog", {
      owner: userDetail._id,
      postId: post_id,
      commentBy: userInteract._id,
      content: comment,
    });
    setComment("");

    setTimeout(() => {
      dispatch(reloadDetailBlog(`posts/reload/${post_id}`));
      dispatch(loadAllBlog(`accounts/${userDetail._id}`));
      setLoading(false); // Reset loading state after 1 second
    }, 1000);
  };

  return (
    <Card border="1px solid #DFE0DC" shadow={"md"}>
      <Text
        fontSize="xl"
        fontWeight="bold"
        paddingBlock={"5px"}
        pl={"10px"}
        borderBottom="1px solid #DFE0DC"
        zIndex={99}
        bgColor={"white"}
      >
        Bình luận
      </Text>

      <VStack
        align="stretch"
        paddingBlock={"7px"}
        padding={"15px"}
        spacing={2}
        h={"250px"}
        maxH={"250px"}
        overflowY={"auto"}
        position={"relative"}
      >
        {loading ? (
          <>
            <Stack>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton height="37px" key={index} />
              ))}
            </Stack>
          </>
        ) : (
          // Show skeleton loader while loading

          // Render comments after loading
          comments.map((comment, index) => (
            <Comment
              key={index}
              comment={comment}
              ownerId={userDetail._id}
              userInteractId={userInteract._id}
              dispatch={dispatch}
              post_id={post_id}
              detail={true}
            />
          ))
        )}
      </VStack>
      <FormControl
        padding={"7px 10px"}
        borderTop={"1px solid #DFE0DC"}
        zIndex={"99"}
      >
        <Flex zIndex={999}>
          <Input
            type="text"
            placeholder="Nhập bình luận của bạn"
            variant="outline"
            flex="1"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            isDisabled={loading} // Disable input during skeleton loading
          />
          <Button
            type="submit"
            variant="solid"
             colorScheme="blue"
              bg="#2d5be4"
            ml="2"
            onClick={commentHandle}
          >
           <BiSolidSend fontSize={'20px'}/>
          </Button>
        </Flex>
      </FormControl>
    </Card>
  );
};

export default CommentList;
