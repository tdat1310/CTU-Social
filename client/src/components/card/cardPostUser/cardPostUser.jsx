import {
  Card,
  useDisclosure,
  Button,
  Input,
  Flex,
  Text,
} from "@chakra-ui/react";
import FileAndPicRender from "./render/fileAndPicRender";
import ContentRender from "./render/contentRender";
import HeaderRender from "./render/headerRender";
import FooterRender from "./render/footerRender";
import ModalCustom from "../../Modal/modalCustom";
import CommentRender from "./render/commentRender";
import { useContext, useRef, useState } from "react";
import BlogApi from "../../../apis/blogApi";
import { LuSendHorizonal } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../provider/socketContext";
import { loadAllBlog } from "../../../Redux/slices/blogSlice";
import { fetchGlobalData } from "../../../Redux/slices/globalSlice";
import { getAllPostByTagId } from "../../../Redux/slices/tagSlice";
import { useParams } from "react-router-dom";
import {
  fetchAllPosttTypeGroup,
  fetchGroupDetails,
} from "../../../Redux/slices/groupSlice";
import { BiSolidSend } from "react-icons/bi";
const CardPostUser = ({
  blogData,
  userDetail,
  post_id,
  setProgress,
  setReload,
  feed,
  detail,
  tag,
  tagPost,
  group,
  groupAll,
}) => {
 // console.log(blogData);
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const userInteract = useSelector((state) => state.auth.userDetail);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { tag_id, group_id } = useParams();
  const inputFocusRef = useRef(null);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const handleCreatePostClick = () => {
    onOpen();
  };
  const commentHandle = async () => {
    socket.emit("commentBlog", {
      owner: blogData.ownerPost,
      postId: post_id,
      commentBy: userInteract._id,
      content: comment,
    });
  };
  const renderComment = () => {
    return (
      <>
        <FooterRender
          post_id={blogData.post_id}
          inputFocusRef={inputFocusRef}
          userLikeList={blogData.LikedBy}
          userSaveList={blogData.SavedBy}
          userDetail={userDetail}
          comment={blogData.commentNum}
          userInteract={userInteract}
          detail={false}
          dispatch={dispatch}
          setReload={setReload}
          ownerPost={blogData.ownerPost}
          blogData={blogData}
          feed={feed}
          tag={tag}
          tagPost={tagPost}
          group={group}
          groupAll={groupAll}
        />
        <Flex
          direction={"column"}
          p={"10px"}
          gap={3}
          borderTop="1px solid #DFE0DC"
        >
          {blogData.comments.length !== 0 && (
            <CommentRender
              blogData={blogData}
              setProgress={setProgress}
              user_id={userDetail._id}
              userInteract={userInteract}
              loading={loading}
              setLoading={setLoading}
              feed={feed}
              tag={tag}
              tagPost={tagPost}
              group={group}
              groupAll={groupAll}
            />
          )}
          <Flex gap={2} pt={"10px"}>
            <Input
              type={"text"}
              placeholder={"Viết bình luận..."}
              ref={inputFocusRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              type="submit"
              variant="solid"
              colorScheme="blue"
              bg="#2d5be4"
              onClick={() => {
                if (comment !== "") {
                  commentHandle();
                  setTimeout(() => {
                    dispatch(
                      loadAllBlog(`accounts/${userDetail._id}?post=${tagPost}`)
                    );
                    if (feed)
                      dispatch(
                        fetchGlobalData(`infos/globalData?post=${tagPost}`)
                      );
                    if (tag)
                      dispatch(
                        getAllPostByTagId(
                          `posts/postByTag/${tag_id}?post=${tagPost}`
                        )
                      );
                    if (group)
                      dispatch(
                        fetchGroupDetails(
                          `groups/get/group/detail/${group_id}?post=${tagPost}`
                        )
                      );
                    if (groupAll)
                      dispatch(
                        fetchAllPosttTypeGroup(
                          `groups/get/postTypeGroup/${userDetail._id}?post=${tagPost}`
                        )
                      );
                  }, 1000);
                  setComment("");
                  setLoading(true);
                }
              }}
            >
              <BiSolidSend fontSize={"20px"} />
            </Button>
          </Flex>
        </Flex>
      </>
    );
  };
  return (
    <>
      <Card w={"90%"} shadow={"md"} border={"1px solid #DFE0DC"}>
        <HeaderRender
          userDetail={userDetail}
          post_id={post_id}
          blogData={blogData}
          ownerPost={blogData.ownerPost}
          feed={feed}
          userInteract={userInteract}
          tag={tag}
          tagPost={tagPost}
          handleCreatePostClick={handleCreatePostClick}
          group={group}
          groupAll={groupAll}
        />
        <ContentRender blogData={blogData} />
        <FileAndPicRender
          fileList={blogData.fileList}
          imageList={blogData.imageList}
          blogData={blogData}
          user_id={userDetail._id}
          setProgress={setProgress}
        />

        {blogData?.fromGroup ? (
          blogData.fromGroup?.ThanhVien?.includes(userInteract._id) ? (
            <>{renderComment()}</>
          ) : (
            <Flex w="100%" m="0 auto" textAlign={'center'} p={'10px'} fontWeight={'600'}>
              <Text w={'100%'}>Tham gia nhóm để có thể tương tác</Text>
            </Flex>
          )
        ) : (
          <>{renderComment()}</>
        )}
      </Card>
      <ModalCustom
        isModalOpen={isModalOpen}
        onClose={onClose}
        editMode={true}
        detail={false}
        blogData={blogData}
        feed={feed}
        tag={tag}
        group={group}
        groupAll={groupAll}
        tagPost={tagPost}
      />
    </>
  );
};

export default CardPostUser;
