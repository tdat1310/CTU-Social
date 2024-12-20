/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Grid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BsFillGearFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FollowButton from "../common/followButton";
import { PiChatCircleTextBold } from "react-icons/pi";
import { loadAllRoom, setRefBoxChat } from "../../Redux/slices/chatSlice";
import { SocketContext } from "../../provider/socketContext";
import { MdEditNote } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
const ProfileHeader = ({ data, setReload }) => {
  const userData = data.user || data; // Sử dụng `data.user` nếu có, nếu không thì dùng `data`
  const MotionBox = motion(Box);
  const menuItems = [
    "Sửa thông tin cá nhân",
    "Chỉnh sửa trang cá nhân",
    "Quản lý bảo mật",
  ];
  const userAcc = useSelector((state) => state.auth.userDetail);
  const { role } = useParams();
  const [isFollow, setFollow] = useState(false);
  const [isImageVisible, setImageVisible] = useState(false); // Thêm trạng thái cho ảnh
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  useEffect(() => {
    if (userData && userData.NguoiTheoDoi) {
      setFollow(
        userData?.NguoiTheoDoi?.some((follower) => follower._id === userAcc._id)
      );
    }

    const timer = setTimeout(() => {
      setImageVisible(true);
    }, 500);

    return () => clearTimeout(timer); // Xóa timeout nếu component bị unmount
  }, [userAcc?._id, userData?.NguoiTheoDoi]);

  return (
    <Box as="header" position="relative" w="full" mb={8}>
      {/* Cover Image */}
      <Box w="full" h="200px" overflow="hidden" position="relative">
        {isImageVisible && (
          <Image
            src={
              userData.coverPic
                ? userData.coverPic.display_url
                : "/src/assets/no-cover.png"
            }
            alt="Cover Image"
            objectFit={'cover'}
            w="full"
            h="100%"
          />
        )}
      </Box>

      <Grid
        templateColumns="1fr 1fr"
        w="100%"
        bgColor="#ecf2f7"
        shadow="md"
        bg={"white"}
        borderBottom="1px solid #BFCFE7"
      >
        {/* Profile Image and Name */}
        <Flex align="center" ml="40px" h="121px">
          <Box position="relative">
            <Box
              boxSize="150px"
              borderRadius="full"
              overflow="hidden"
              border="5px solid #2d5be4"
              boxShadow="lg"
              mr={4}
              top="-110px"
              position="absolute"
            >
              {isImageVisible && (
                <Image
                  src={
                    userData.avtPic
                      ? userData.avtPic.display_url
                      : "/src/assets/no-avt.png"
                  }
                  alt="Profile Image"
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              )}
            </Box>
          </Box>
          <Flex
            direction="column"
            ml="160px"
            mb="25px"
            mt={role === "guest" ? "10px" : "3px"}
          >
            <Text fontSize="2xl" fontWeight="bold">
              {userData.userName}
            </Text>
            <Text fontSize="16px" fontWeight="300">
              {userData.NguoiTheoDoi?.length || 0} người theo dõi
            </Text>
            {role === "guest" && (
              <Flex gap={"5px"}>
                <FollowButton
                  owner={userData._id}
                  followBy={userAcc._id}
                  follow={isFollow}
                  setReload={setReload}
                  dispatch={dispatch}
                />
                <Button
                  mt={"5px"}
                  bgColor={"#229799"}
                  color={"white"}
                  leftIcon={<PiChatCircleTextBold />}
                  _hover={{
                    bgColor: "#227B94",
                  }}
                  onClick={() => {
                    dispatch(
                      setRefBoxChat({
                        url: "chat/createOrFind/room",
                        data: {
                          userId: userAcc._id,
                          otherUserId: userData._id,
                        },
                      })
                    );
                    dispatch(loadAllRoom(`chat/get/room/${userAcc._id}`));

                    setTimeout(() => {
                      socket.emit("createGroupChat", {
                        memberIds: [userData._id],
                        owner: userAcc._id,
                        type: "user",
                      });
                      navigate("/chat");
                    }, 500);
                  }}
                >
                  Nhắn tin
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
        {role == "user" && (
          <Flex
            h="100%"
            justifyContent="flex-end"
            alignItems="center"
            pr="40px"
          >
            <Button
              leftIcon={
                <Box
                  fontSize="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaEdit />
                </Box>
              }
              bg="blue.500"
              color="white"
              borderRadius="md"
              shadow="lg"
             
              bgColor={"#2d5be4"}
              _hover={{
                bg: "#234ca1",
                transform: "scale(1.02)",
                shadow: "xl",
              }}
              _active={{
                bg: "blue.700",
              }}
              onClick={() => navigate("/editProfile")}
              border="1px solid #cbd5e0"
              size="md"
              px={6} // Tăng padding ngang để chữ và icon không sát nhau
            >
              Sửa thông tin
            </Button>
          </Flex>
        )}
      </Grid>
    </Box>
  );
};

export default ProfileHeader;
