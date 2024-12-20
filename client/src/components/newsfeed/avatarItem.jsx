import React, { useContext } from "react";
import { Flex, Avatar, Text, Box, Button, Tooltip } from "@chakra-ui/react";
import { SlUserFollow } from "react-icons/sl";
import { TiPlus } from "react-icons/ti";
import { UserApi } from "../../apis/userApi";
import { useDispatch, useSelector } from "react-redux";
import { reloadData } from "../../Redux/slices/authSlice";
import { SocketContext } from "../../provider/socketContext";
import { getUserRecommend } from "../../Redux/slices/globalSlice";
import { useNavigate } from "react-router-dom";
import { FaHashtag } from "react-icons/fa6";
const AvatarItem = ({ item, type, leftSection }) => {
  const userDetail = useSelector((state) => state.auth.userDetail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  return (
    <Flex align="center" mb={2} justifyContent={"space-between"} w={"100%"}>
      <Flex align="center">
        {type === "tag" ? (
          <Box>
            <Flex alignItems={'center'} color={'#2d5be4'} fontWeight={600} fontSize={'18px'}>
              <FaHashtag/>
            <Text > {item.TenTag}</Text>
            </Flex>
            <Text fontSize={"12px"} color={"gray.500"}>
              {item.baiDang_id?.length} bài viết
            </Text>
          </Box>
        ) : (
          <>
            <Avatar
              size={item.type === "user" ? "sm" : "md"}
              border={'3px solid #2d5be4'}
              name={item.userName}
              src={item.avtPic ? item.avtPic.display_url : "/src/assets/no-avt.png"}
              boxSize={item.type === "group" ? "40px" : undefined}
              borderRadius={item.type === "group" ? "10px" : undefined}
              objectFit="cover"
              onClick={() => {
                navigate(`/account/guest/${item._id}`);
              }}
              cursor={"pointer"}
            />
            <Flex flexDirection={"column"}>
              <Text
                ml={2}
                fontWeight={"500"}
                onClick={() => {
                  navigate(`/account/guest/${item._id}`);
                }}
                cursor={"pointer"}
              >
                {item.userName}
              </Text>
              <Tooltip
                placement={"bottom-end"}
                label={
                  <Box maxH="100px" overflow="hidden" whiteSpace="pre-line">
                    {item.mutualFollowers
                      ? item.mutualFollowers
                          .slice(0, 3)
                          .map((follower) => follower.userName)
                          .join("\n") +
                        (item.mutualFollowers.length > 3 ? "\n..." : "")
                      : "Không có người theo dõi chung"}
                  </Box>
                }
                aria-label="Danh sách người theo dõi chung"
                hasArrow
              >
                <Text
                  ml={2}
                  fontSize={"13px"}
                  color={"#2d5be4"}
                  fontWeight={"600"}
                  cursor="pointer"
                >
                  {item.mutualFollowersCount} người theo dõi chung
                </Text>
              </Tooltip>
            </Flex>
          </>
        )}
      </Flex>

      {leftSection && (
        <Flex alignItems={"center"} gap={"10px"} mt={"8px"}>
          {type === "user" && (
            <Box
              color={"#31a64a"}
              _hover={{
                color: "#78d98b",
              }}
              transition={"1s"}
              cursor={"pointer"}
              fontSize={"20px"}
            >
              <SlUserFollow />
            </Box>
          )}

          {type === "tag" && (
            <Button
              _hover={{
                bg: "#234ca1",
              }}
              size="sm"
              bgColor={"#2d5be4"}
              color={"white"}
              onClick={() => {
                // Điều hướng đến trang chứa thông tin tag
                navigate(`/tags/${item.TenTag}/${item._id}`);
              }}
            >
              Xem
            </Button>
          )}

          {type === "follow" && (
            <Box
              color={"#black"}
              _hover={{
                color: "#3983c1",
              }}
              cursor={"pointer"}
              fontSize={"25px"}
              onClick={async () => {
                socket.emit("followUser", {
                  owner: item._id,
                  followBy: userDetail._id,
                  opt: 2,
                });
                setTimeout(() => {
                  dispatch(reloadData(`accounts/reload/${userDetail._id}`));
                  dispatch(
                    getUserRecommend(`infos/get/userRcm/${userDetail._id}`)
                  );
                }, 300);
              }}
            >
              <TiPlus />
            </Box>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default AvatarItem;
