import {
  Box,
  Card,
  Text,
  VStack,
  HStack,
  Flex,
  Avatar,
  Heading,
  Menu,
  MenuList,
  MenuButton,
  IconButton,
  MenuItem,
  AvatarGroup,
} from "@chakra-ui/react";
import React from "react";
import FooterRender from "../card/cardPostUser/render/footerRender";
import { FaHashtag } from "react-icons/fa6";
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import RenderFiles from "../../utils/renderFiles";

const Content = ({
  userName,
  postDetail,
  handleCreatePostClick,
  justContent,
  userInteract,
  dispatch,
  userDetail,
}) => {
  // console.log(postDetail);
  const group = postDetail?.fromGroup;
  const navigate = useNavigate();
  return (
    <Card border="1px solid #DFE0DC" shadow={"md"} zIndex={"99"} h={"60%"}>
      <Flex
        paddingBlock={"10px"}
        paddingInline={"15px"}
        borderBottom="1px solid #DFE0DC"
        justifyContent={"space-between"}
      >
        <Flex direction={"column"}>
          {postDetail.Tags.length > 0 ? (
            <HStack spacing={3} color={"blue.500"}>
              {postDetail.Tags.map((tag, index) => (
                <Flex fontWeight={500} key={index}>
                  <FaHashtag style={{ marginTop: "7px" }} />
                  <Text fontSize={"19px"}>{tag.TenTag}</Text>
                </Flex>
              ))}
            </HStack>
          ) : (
            <Text fontSize={"19px"} fontWeight={"500"} h={'15px'}>
            
            </Text>
          )}
          <Text
            fontSize="2xl"
            fontWeight="bold"
            maxW={"400px"}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {postDetail.title}
          </Text>
        </Flex>
        <Flex gap="4" alignItems="center">
          <Flex flexDirection={"column"} alignItems={"flex-end"}>
            {postDetail.fromGroup && (
              <Text
                fontWeight={"700"}
                cursor={"pointer"}
                maxW={"200px"}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                onClick={() => {
                  navigate(`/group/${postDetail.fromGroup._id}`);
                }}
              >
                {postDetail.fromGroup.TenNhom}
              </Text>
            )}
            <Text
              fontSize={"18px"}
              maxW={"200px"}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              fontWeight={postDetail.fromGroup ? "400" : "500"}
              cursor={'pointer'}
              onClick={()=>{
                if(userDetail._id === userInteract._id){
                  navigate('/account/user')
                }else{
                  navigate(`/account/guest/${userDetail._id}`)
                }
              }}
            >
              {userName}
            </Text>
          </Flex>
          <AvatarGroup stacking="last-on-top">
            {postDetail.fromGroup && (
              <Avatar
                // name="Segun Adebayo"
                // src="/src/assets/no-avt.png"
                borderRadius={"10px"}
              />
            )}

            <Avatar
              name="Segun Adebayo"
              size={postDetail.fromGroup ? "sm" : "md"}
              zIndex={2}
              mt={postDetail.fromGroup && "19px"}
              ml={postDetail.fromGroup && "-10px"}
              src={
                postDetail.TaiKhoan_id.avtPic
                  ? postDetail.TaiKhoan_id.avtPic.display_url
                  : "/src/assets/no-avt.png"
              }
            />
          </AvatarGroup>

          {justContent && userInteract._id === postDetail.TaiKhoan_id._id ? (
            <Box w={"30px"}>
              <Menu>
                <MenuButton
                  aria-label="more options"
                  variant="ghost"
                  position="absolute"
                  top={"10px"}
                  right={"10px"}
                  p={"10px"}
                  zIndex={2}
                  mt={"7px"}
                >
                  <MdOutlineMenu size="30px" />
                </MenuButton>
                <MenuList border="1px solid #DFE0DC">
                  <MenuItem onClick={handleCreatePostClick}>
                    Sửa bài viết
                  </MenuItem>
                  <MenuItem onClick={() => alert("Delete post")}>
                    Xóa bài viết
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          ) : (
            ""
          )}
        </Flex>
      </Flex>
      <Box
        flex={1}
        overflowY={"auto"}
        h={"150px"}
        maxH={"150px"}
        paddingBlock={"10px"}
        paddingInline={"15px"}
        dangerouslySetInnerHTML={{ __html: postDetail.content }}
      ></Box>
      {justContent && (
        <Flex direction={"column"} mb={"10px"}>
          <RenderFiles files={postDetail.fileList} detail={true} />
        </Flex>
      )}
      <Box borderTop="1px solid #DFE0DC">
        {!group ? (
          <FooterRender
            userLikeList={postDetail.LikedBy}
            userSaveList={postDetail.SavedBy}
            post_id={postDetail.post_id}
            userInteract={userInteract}
            save={postDetail.saveNum}
            like={postDetail.likeNum}
            comment={postDetail.commentNum}
            dispatch={dispatch}
            userDetail={userDetail}
            detail={true}
          />
        ) : postDetail.fromGroup.ThanhVien.includes(userInteract._id) ? (
          <FooterRender
            userLikeList={postDetail.LikedBy}
            userSaveList={postDetail.SavedBy}
            post_id={postDetail.post_id}
            userInteract={userInteract}
            save={postDetail.saveNum}
            like={postDetail.likeNum}
            comment={postDetail.commentNum}
            dispatch={dispatch}
            userDetail={userDetail}
            detail={true}
          />
        ) : (
          <Flex
            w={"100%"}
            mt={"40px"}
            justifyContent={"center"}
            alignItems={"center"}
            fontWeight={"600"}
          >
            <Text>Tham gia nhóm để tương tác</Text>
          </Flex>
        )}
      </Box>
    </Card>
  );
};

export default Content;
