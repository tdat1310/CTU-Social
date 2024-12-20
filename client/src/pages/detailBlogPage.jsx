/* eslint-disable react-hooks/exhaustive-deps */
import Carousel from "../components/detailBlog/carousel";
import {
  Card,
  Grid,
  Text,
  VStack,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import Content from "../components/detailBlog/content";
import CommentList from "../components/detailBlog/commentList";
import { useDispatch, useSelector } from "react-redux";
import RenderFiles from "../utils/renderFiles";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserApi } from "../apis/userApi";
import ModalCustom from "../components/Modal/modalCustom";
import Spinner from "../components/common/spinner";
import { SocketContext } from "../provider/socketContext";
import { loadAllBlog, reloadDetailBlog } from "../Redux/slices/blogSlice";
import BlogApi from "../apis/blogApi";

const DetailBlogPage = () => {
  const postDetail = useSelector((state) => state.blog.postDetail);
  const userInteract = useSelector((state) => state.auth.userDetail);
  const userDetail = useSelector((state) => state.blog.userDetail);
  const [loading, setLoading] = useState(true); // Ban đầu là true để tàng hình
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const handleCreatePostClick = () => {
    onOpen();
  };
  const { role, user_id, index, post_id } = useParams();
  const [userName, setUserName] = useState(
    role === "user" ? userDetail.userName : ""
  );
  useEffect(() => {
    socket.on("notify_response", (data) => {
      dispatch(reloadDetailBlog(`posts/reload/${post_id}`));
      dispatch(loadAllBlog(`accounts/${userDetail._id}`));
      setLoading(false);
    });
  }, [socket, dispatch]);
  const group = postDetail.fromGroup;
  const navigate = useNavigate();
  useEffect(() => {
    // console.log(postDetail)
    const fetchUserName = async () => {
      try {
        const name = await UserApi.getUserName(`accounts/userName/${user_id}`);
        setUserName(name);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    if (role === "guest") fetchUserName();
    if (role === "guest" && user_id === userInteract._id) {
      // navigate(`/account/user/post/${post_id}`);
    } else if (role === "guest") {
      fetchUserName();
    }
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [role, user_id, post_id, userInteract._id, navigate]);

  const justContent =
    postDetail && postDetail?.imageList.length === 0 ? true : false;
  const hasFile = postDetail?.fileList?.length === 0 ? false : true;

  const deleteHandle = async () =>{
    const data = {
      user_id: role === "guest" ? user_id : userInteract._id
    };

    await BlogApi.deleteBlog(`posts/${post_id}`, data);
    navigate('/newsfeed')
  }
  return (
    <>
      {loading && <Spinner />}

      <Grid
        templateColumns={!justContent ? "6fr 4fr" : "1fr"}
        gap={4}
        h={"100vh"}
        p={"10px"}
        bgColor={"#eeeeee"}
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 0.1s ease-in-out",
        }} // Tàng hình và hiện dần
      >
        {!justContent && (
          <VStack spacing={2} h={"100%"}>
            <Carousel
              listImg={postDetail.imageList}
              role={role}
              handleCreatePostClick={handleCreatePostClick}
              index={index}
              deleteHandle={deleteHandle}
            />
            {hasFile && (
              <Card
                border="1px solid #DFE0ee"
                h={"15%"}
                w={"100%"}
                p={"10px 15px"}
                shadow={"md"}
              >
                <Flex direction={"column"}>
                  <Text fontSize={"19px"} fontWeight={"700"}>
                    Danh sách file
                  </Text>
                  <RenderFiles files={postDetail.fileList} detail={true} />
                </Flex>
              </Card>
            )}
          </VStack>
        )}

        <VStack
          align="stretch"
          h={"100%"}
          gap={4}
          w={justContent && "60%"}
          m={justContent && "0 auto"}
        >
          <Content
            userName={userName}
            justContent={justContent}
            postDetail={postDetail}
            userInteract={userInteract}
            handleCreatePostClick={handleCreatePostClick}
            dispatch={dispatch}
            userDetail={userDetail}
          />
          {!group ? (
            <CommentList
              comments={postDetail.comments}
              post_id={postDetail.post_id}
              userInteract={userInteract}
              userDetail={userDetail}
            />
          ) : (
            group.ThanhVien.includes(userInteract._id) && (
              <CommentList
                comments={postDetail.comments}
                post_id={postDetail.post_id}
                userInteract={userInteract}
                userDetail={userDetail}
              />
            )
          )}
        </VStack>
      </Grid>
      <ModalCustom
        isModalOpen={isModalOpen}
        onClose={onClose}
        editMode={true}
        detail={true}
        blogData={postDetail}
      />
    </>
  );
};

export default DetailBlogPage;
