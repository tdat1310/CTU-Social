/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Flex,
  Text,
  VStack,
  Input,
  useDisclosure,
  Spinner,
  Progress,
  useToast,
  Button,
  InputRightElement,
  InputGroup,
  Divider,
} from "@chakra-ui/react";
import Header from "../components/common/header";
import EditGroupModal from "../components/Modal/editGroupModal";
import MemberListModal from "../components/Modal/memberListModal";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchPost,
  fetchGroupDetails,
  searchPost,
} from "../Redux/slices/groupSlice";
import { useNavigate, useParams } from "react-router-dom";
import ModalCustom from "../components/Modal/modalCustom";
import CardPostUser from "../components/card/cardPostUser/cardPostUser";
import DataFormat from "../utils/dataFormat";
import CreateGroupModal from "../components/Modal/createGroupModal";
import AttachApi from "../apis/attachApi";
import GroupApi from "../apis/groupApi";
import RequestListModal from "../components/Modal/requestListModal";
import { SocketContext } from "../provider/socketContext";
import { MdPostAdd } from "react-icons/md";
import { PiImageBold } from "react-icons/pi";
import { FiFile } from "react-icons/fi";
import PicDisplay from "../components/groupPage/picDisplay";
import FileDisplay from "../components/groupPage/fileDisplay";
import InfoDisplay from "../components/groupPage/infoDisplay";
import { AiOutlineSearch } from "react-icons/ai";
import SearchDisplay from "../components/groupPage/searchDisplay";
const GroupDetail = () => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [post, setPost] = useState(3);
  const [isFetching, setIsFetching] = useState(false);
  const [hide, setHide] = useState(true);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const { group_id } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [isSearching, setIsSearching] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  let requestCount = 3;
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  let notifyList = useSelector((state) => state.notify.notifyList) || [];

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isMemberOpen,
    onOpen: onMemberOpen,
    onClose: onMemberClose,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const groupDetails = useSelector((state) => state.group.groupDetails) || [];
  const attachments = useSelector((state) => state.group.attachments) || [];
  const userDetail = useSelector((state) => state.auth.userDetail);
  const [currentTab, setCurrentTab] = useState("posts"); // "posts", "photos", "files"
  let isLeader = groupDetails?.TruongNhom?._id == userDetail._id;
  const allPost = useSelector((state) => state.group.groupPosts);
  const totalPost = useSelector((state) => state.group.totalPosts);
  const searchResult = useSelector((state) => state.group.searchResult);
  const filteredRequests = notifyList.filter(
    (request) =>
      request.fromGroup === groupDetails._id &&
      request.NoiDung.type === "request"
  );
  const [searchValue, setSearchValue] = useState("");

  const handleFocus = () => {
    setCurrentTab("search");
  };
  const handleUpdate = async (updates) => {
    let info = {};
    info.groupId = group_id;

    if (updates.coverImage) {
      const res = await AttachApi.createAttach(
        `groups/upload/coverPicGroup/${group_id}`,
        [updates.coverImage],
        "group",
        "hello",
        userDetail._id
      );

      info.coverPic = res[0]._id; // Gán trực tiếp ngay sau khi có kết quả
    }

    if (updates.name) info.TenNhom = updates.name;
    if (updates.description) info.MoTa = updates.description;

    await GroupApi.updateGroupInfo("groups/editInfo/group", info);

    setTimeout(() => {
      dispatch(
        fetchGroupDetails(`groups/get/group/detail/${group_id}?post=${post}`)
      );
    }, 100);
  };

  const toast = useToast();
  const showToast = (status, title, description) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  useEffect(() => {
    setIsFetching(true);
    dispatch(
      fetchGroupDetails(`groups/get/group/detail/${group_id}?post=${post}`)
    );
    const timer = setTimeout(() => {
      setIsFetching(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [post]);

  useEffect(() => {
    setIsSearching(false);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    fetchGroupDetails(`groups/get/group/detail/${group_id}?post=${post}`);
  }, [dispatch, group_id]);

  const transformedBlogs = allPost.map((post) => DataFormat(post));

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    if (scrollTop + clientHeight >= scrollHeight) {
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

  // Kiểm tra người dùng có phải là thành viên của nhóm hay không
  const isMember = groupDetails?.ThanhVien?.some(
    (user) => user._id === userDetail._id
  );
  useEffect(() => {
    socket.on("navigate", () => {
      navigate("/group");
    });
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchLoading(true);
    dispatch(
      searchPost(
        `groups/search/post/${groupDetails._id}?keyword=${searchValue}`
      )
    );
    setTimeout(() => {
      setSearchLoading(false); // Tắt loading sau 1 giây
    }, 1200);
  };
  return (
    <>
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
              <Box w={"80%"} mx="auto" p={4}>
                <InfoDisplay
                  groupDetails={groupDetails}
                  isLeader={isLeader}
                  isMember={isMember}
                  socket={socket}
                  onEditOpen={onEditOpen}
                  navigate={navigate}
                  userDetail={userDetail}
                  group_id={group_id}
                  dispatch={dispatch}
                  post={post}
                  setIsRequestOpen={setIsRequestOpen}
                  requestCount={requestCount}
                  filteredRequests={filteredRequests}
                  onMemberOpen={onMemberOpen}
                  setIsInviteOpen={setIsInviteOpen}
                />
                <Flex w={"100%"} justifyContent={"space-between"}>
                  <Box display="flex" mb={4} w={"30%"} gap={"10px"}>
                    <Button
                      onClick={() => {
                        setCurrentTab("posts");
                        setIsSearching(false);
                        if (searchValue !== "") setSearchValue("");
                        dispatch(clearSearchPost());
                      }}
                      leftIcon={
                        <Box fontSize={"20px"}>
                          <MdPostAdd />
                        </Box>
                      }
                      bg={currentTab === "posts" ? "#2e5be0" : "#e7ebf6"}
                      _hover={{
                        bg: currentTab === "posts" ? "#234ca1" : "#dedee7",
                      }}
                      color={currentTab === "posts" ? "white" : "black"}
                      // colorScheme={currentTab === "posts" ? "blue" : "gray"}
                    >
                      Bài Viết
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentTab("photos");
                        setIsSearching(false);
                        if (searchValue !== "") setSearchValue("");
                        dispatch(clearSearchPost());
                      }}
                      leftIcon={
                        <Box fontSize={"20px"}>
                          <PiImageBold />
                        </Box>
                      }
                      bg={currentTab === "photos" ? "#2e5be0" : "#e7ebf6"}
                      _hover={{
                        bg: currentTab === "photos" ? "#234ca1" : "#dedee7",
                      }}
                      color={currentTab === "photos" ? "white" : "black"}
                    >
                      Ảnh
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentTab("files");
                        setIsSearching(false);
                        if (searchValue !== "") setSearchValue("");
                        dispatch(clearSearchPost());
                      }}
                      leftIcon={
                        <Box fontSize={"20px"}>
                          <FiFile />
                        </Box>
                      }
                      bg={currentTab === "files" ? "#2e5be0" : "#e7ebf6"}
                      _hover={{
                        bg: currentTab === "files" ? "#234ca1" : "#dedee7",
                      }}
                      color={currentTab === "files" ? "white" : "black"}
                    >
                      File
                    </Button>
                  </Box>

                  <InputGroup w={"30%"} ml={4}>
                    <Input
                      placeholder="Tìm kiếm..."
                      onFocus={handleFocus}
                      value={searchValue}
                      bg={"#edf2f5"}
                      _placeholder={{
                        color: "#b0aaab",
                        fontWeight: "500",
                      }}
                      border="1px solid #DFE0DC"
                      shadow={"md"}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();

                          // Gọi hàm xử lý khi nhấn Enter
                        }
                      }}
                    />

                    <InputRightElement>
                      <Box as={AiOutlineSearch} fontSize={"20px"} />
                    </InputRightElement>
                  </InputGroup>
                </Flex>
                <Divider bg={"gray.400"} marginBlock={2} />
                {/* Phần bài viết đã đăng */}
                {currentTab === "posts" && (
                  <Box
                    borderWidth={1}
                    borderColor="gray.400"
                    borderRadius="lg"
                    p={4}
                    boxShadow="sm"
                    bg="white"
                    w={"75%"}
                    m={"0 auto"}
                  >
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                      Bài viết
                    </Text>
                    {isMember ? ( // Kiểm tra xem người dùng có phải là thành viên không
                      <>
                        <Flex
                          align="center"
                          onClick={onModalOpen}
                          p={4}
                          bg="linear-gradient(to right, #2d5be4 0%, #ecf2f7 100%)"
                          borderRadius="20px"
                          overflow={"hidden"}
                          mb={4}
                          cursor="pointer"
                          shadow="md"
                          w={"91%"}
                          m={"0 auto"}
                          transition={"0.2s"}
                          _hover={{ transform: "scale(1.02)" }}
                        >
                          <Avatar
                            size="md"
                            name="User Name"
                            src={
                              userDetail.avtPic
                                ? userDetail.avtPic.display_url
                                : "/src/assets/no-avatar.png"
                            }
                          />
                          <Input
                            ml={4}
                            placeholder="Bạn đang nghĩ gì?.."
                            isReadOnly
                            _placeholder={{
                              fontWeight: "500",
                            }}
                            bg="white"
                            border="none"
                            _focus={{ border: "none" }}
                            cursor={"pointer"}
                          />
                        </Flex>
                        <VStack w={"100%"} spacing={"20px"} mt={"20px"}>
                          {transformedBlogs.map((blogData, index) => (
                            <CardPostUser
                              key={index}
                              blogData={blogData}
                              userDetail={blogData.TaiKhoan_id}
                              post_id={blogData.post_id}
                              setProgress={setProgress}
                              feed={false}
                              tag={false}
                              tagPost={post}
                              group={true}
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
                      </>
                    ) : (
                      <Text fontSize="lg" color="gray.500">
                        Bạn không phải là thành viên của nhóm này, nên không thể
                        xem bài viết.
                      </Text>
                    )}
                  </Box>
                )}
                {currentTab === "photos" && (
                  <>
                    <PicDisplay
                      photos={attachments.postPics}
                      navigate={navigate}
                      dispatch={dispatch}
                      userDetail={userDetail}
                      isMember={isMember}
                    />
                  </>
                )}

                {currentTab === "files" && (
                  <>
                    <FileDisplay
                      files={attachments.postFiles}
                      navigate={navigate}
                      dispatch={dispatch}
                      userDetail={userDetail}
                      isMember={isMember}
                    />
                  </>
                )}
                {currentTab === "search" &&
                  (isMember ? (
                    <SearchDisplay
                      isSearching={isSearching}
                      searchResults={searchResult}
                      loading={searchLoading}
                      userDetail={userDetail}
                      dispatch={dispatch}
                      navigate={navigate}
                    />
                  ) : (
                    <Box
                      w={"100%"}
                      textAlign={"center"}
                      h={"200px"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Text fontSize="lg" color="gray.500" p={3}>
                        Hãy tham gia nhóm để tìm kiếm tài liệu
                      </Text>
                    </Box>
                  ))}
              </Box>
            </>
          )}
        </VStack>
        <>
          {!loading && (
            <>
              {/* Modal cho việc chỉnh sửa thông tin nhóm */}
              <EditGroupModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                groupDetails={groupDetails}
                onUpdate={handleUpdate}
              />
              {/* Modal cho danh sách thành viên */}
              <MemberListModal
                isOpen={isMemberOpen}
                onClose={onMemberClose}
                members={groupDetails.ThanhVien}
                groupDetails={groupDetails}
                userDetail={userDetail}
              />
              {/* Modal cho việc tạo bài viết */}
              <ModalCustom
                isModalOpen={isModalOpen}
                onClose={onModalClose}
                editMode={false} // Sửa modal tùy theo mục đích sử dụng
                detail={false}
                feed={false}
                tag={false}
                tagPost={false}
                group={true} // Group modal là true
              />

              <CreateGroupModal
                isModalOpen={isInviteOpen}
                setIsModalOpen={setIsInviteOpen}
                showToast={showToast}
                create={false}
                groupDetails={groupDetails}
              />
              <RequestListModal
                isOpen={isRequestOpen}
                requestList={notifyList}
                groupId={groupDetails._id}
                onClose={() => setIsRequestOpen(false)}
              />
            </>
          )}
        </>
      </>
    </>
  );
};

export default GroupDetail;
