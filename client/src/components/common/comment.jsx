import {
  Avatar,
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import BlogApi from "../../apis/blogApi";
import { loadAllBlog, reloadDetailBlog } from "../../Redux/slices/blogSlice";
import { fetchGlobalData } from "../../Redux/slices/globalSlice";
import { getAllPostByTagId } from "../../Redux/slices/tagSlice";
import { useParams } from "react-router-dom";
import {
  fetchAllPosttTypeGroup,
  fetchGroupDetails,
} from "../../Redux/slices/groupSlice";
import { useSelector } from "react-redux";
const Comment = ({
  comment,
  ownerId,
  userInteractId,
  dispatch,
  post_id,
  detail,
  feed,
  tag,
  tagPost,
  group,
  groupAll,
}) => {
  const [edit, setEdit] = useState(false);
  const [hide, setHide] = useState(false);
  const { tag_id, group_id } = useParams();
  // console.log(comment);
  const [commentContent, setCommentContent] = useState(comment.content);
  const userDetail = useSelector((state) => state.auth.userDetail);
  const deleteComment = async () => {
    await BlogApi.deleteComment(`posts/delete/comment/${comment.cmt_id}`);
    dispatch(loadAllBlog(`accounts/${ownerId}?post=${tagPost}`));
    if (feed) dispatch(fetchGlobalData(`infos/globalData?post=${tagPost}`));
    if (detail) dispatch(reloadDetailBlog(`posts/reload/${post_id}`));
  };
  const editComment = async () => {
    await BlogApi.editComment(`posts/edit/comment/${comment.cmt_id}`, {
      content: commentContent,
    });
    dispatch(loadAllBlog(`accounts/${ownerId}?post=${tagPost}`));
    if (feed) dispatch(fetchGlobalData(`infos/globalData?post=${tagPost}`));
    if (tag)
      dispatch(getAllPostByTagId(`posts/postByTag/${tag_id}?post=${tagPost}`));
    if (detail) dispatch(reloadDetailBlog(`posts/reload/${post_id}`));
    if (group)
      dispatch(
        fetchGroupDetails(`groups/get/group/detail/${group_id}?post=${tagPost}`)
      );
    if (groupAll)
      dispatch(
        fetchAllPosttTypeGroup(
          `groups/get/postTypeGroup/${userDetail._id}?post=${tagPost}`
        )
      );
    setEdit(false);
  };
  const commentHandle = (opt) => {
    if (opt === 1) {
      editComment();
    }
    if (opt == 2) {
      setEdit(false);
      setCommentContent(comment.content);
    }
  };
  return (
    <Flex gap={"10px"}>
      <Avatar
        size={"sm"}
        alignItems={"center"}
        m={"auto 0"}
        src={comment.avtPic ? comment.avtPic : ""}
      />
      <Flex
        backgroundColor={"#F7F7F7"}
        w={"90%"}
        shadow={'xs'}
        //  border="1px solid #DFE0DC"
        padding={"10px"}
        gap={"10px"}
        borderRadius={"10px"}
        justifyContent={"space-between"}
      >
        <Flex direction={"column"} gap={"5px"} w={"95%"}>
          <Text fontSize={"17px"} fontWeight={"600"}>
            {comment.UserName}
          </Text>
          {edit ? (
            <Input
              variant="flushed"
              w={"100%"}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
          ) : (
            <Text fontSize={"15px"}>{comment.content}</Text>
          )}
        </Flex>
        {!edit ? (
          <Menu p={0} minW="0" w={"5%"} placement={"left-start"}>
            {!hide && (
              <>
                <MenuButton
                  as={IconButton}
                  icon={<HiOutlineDotsVertical />}
                  variant={"link"}
                  fontSize={"18px"}
                  alignItems={"flex-start"}
                  mt={"5px"}
                  color={"black"}
                />
                <MenuList
                  border="1px solid #DFE0DC"
                  fontSize={"14px"}
                  top={"0"}
                  right={"-15"}
                  minW="0"
                  w={"130px"}
                  position={"absolute"}
                >
                  {ownerId === userInteractId ? (
                    <>
                      {comment.user_id === userInteractId ? (
                        <>
                          <MenuItem
                            onClick={() => {
                              setEdit(true);
                            }}
                          >
                            Sửa bình luận
                          </MenuItem>
                          <MenuItem onClick={deleteComment}>
                            Xóa Bình luận
                          </MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem onClick={deleteComment}>
                            Xóa Bình luận
                          </MenuItem>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {userInteractId === comment.user_id ? (
                        <>
                          <MenuItem
                            onClick={() => {
                              setEdit(true);
                            }}
                          >
                            Sửa bình luận
                          </MenuItem>
                          <MenuItem onClick={deleteComment}>
                            Xóa Bình luận
                          </MenuItem>
                        </>
                      ) : (
                        setHide(true)
                      )}
                    </>
                  )}
                </MenuList>
              </>
            )}
          </Menu>
        ) : (
          <Flex direction={"column"} justifyContent={"space-between"}>
            <Button
              border="1px solid #DFE0DC"
              size={"sm"}
              variant="ghost"
              onClick={() => {
                commentHandle(1);
              }}
            >
              Lưu
            </Button>
            <Button
              border="1px solid #DFE0DC"
              size={"sm"}
              variant="ghost"
              onClick={() => {
                commentHandle(2);
              }}
            >
              Hủy
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Comment;
