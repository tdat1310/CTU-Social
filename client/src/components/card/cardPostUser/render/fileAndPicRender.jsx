/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Flex, Text, Image, VStack } from "@chakra-ui/react";
import RenderFiles from "../../../../utils/renderFiles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  blogDetailClear,
  reloadDetailBlog,
} from "../../../../Redux/slices/blogSlice";
const FileAndPicRender = ({
  fileList,
  imageList,
  blogData,
  user_id,
  setProgress,
}) => {
  const userDetail = useSelector((state) => state.auth.userDetail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleImageClick = (index) => {
    setProgress(20);
    dispatch(blogDetailClear());
    dispatch(reloadDetailBlog(`posts/reload/${blogData.post_id}`));
    setTimeout(() => {
      setProgress(100);
      userDetail._id  === blogData.ownerPost
        ? navigate(`/account/user/post/${blogData.post_id}`)
        : navigate(
            `/account/guest/${user_id}/post/${blogData.post_id}`
          );
    }, 1000);
  };

  const renderimageList = (imageList) => {
    const imageCount = imageList.length;
    if (imageCount === 1) {
      return (
        <Flex borderBlock={"1px solid #DFE0DC"} >
          <Image
            flex={1}
            objectFit="cover"
            src={imageList[0].url_display}
            alt={`Image 1`}
            onClick={() => handleImageClick(0)}
            cursor="pointer"
          />
        </Flex>
      );
    } else if (imageCount === 2) {
      return (
        <Flex gap={1} borderBlock={"1px solid #DFE0DC"} h={"200px"}>
          <Box flex="1">
            <Image
              objectFit="cover"
              src={imageList[0].url_display}
              alt={`Image 1`}
              w={"100%"}
              height="100%"
              onClick={() => handleImageClick(0)}
              cursor="pointer"
            />
          </Box>
          <Box flex="1" borderLeft={"1px solid #DFE0DC"}>
            <Image
              objectFit="cover"
              src={imageList[1].url_display}
              alt={`Image 2`}
              w={"100%"}
              h={"100%"}
              onClick={() => handleImageClick(1)}
              cursor="pointer"
            />
          </Box>
        </Flex>
      );
    } else if (imageCount === 3) {
      return (
        <Flex gap={1} borderBlock={"1px solid #DFE0DC"}>
          <Box flex="1">
            <Image
              objectFit="cover"
              src={imageList[0].url_display}
              alt={`Image 1`}
               border="1px solid #DFE0DC"
              height="100%"
              onClick={() => handleImageClick(0)}
              cursor="pointer"
            />
          </Box>
          <Box
            flex="1"
            display="flex"
            gap={1}
            flexDirection="column"
            borderLeft={"1px solid #DFE0DC"}
          >
            <Image
              objectFit="cover"
              src={imageList[1].url_display}
              alt={`Image 2`}
               border="1px solid #DFE0DC"
              onClick={() => handleImageClick(1)}
              cursor="pointer"
            />
            <Image
              objectFit="cover"
              src={imageList[2].url_display}
              alt={`Image 3`}
               border="1px solid #DFE0DC"
              onClick={() => handleImageClick(2)}
              cursor="pointer"
            />
          </Box>
        </Flex>
      );
    } else if (imageCount >= 4) {
      return (
        <Flex gap={1} height="600px">
          <Box flex="1" borderBlock={"1px solid #DFE0DC"}>
            <Image
              objectFit="cover"
              src={imageList[0].url_display}
              alt={`Image 1`}
              border="1px solid #DFE0DC"
              height="100%"
              width="100%"
              onClick={() => handleImageClick(0)}
              cursor="pointer"
            />
          </Box>
          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            gap={1}
            borderLeft={"1px solid #DFE0DC"}
          >
            <Image
              objectFit="cover"
              border="1px solid #DFE0DC"
              src={imageList[1].url_display}
              alt={`Image 2`}
              height="calc(33% - 0.67px)"
              width="100%"
              onClick={() => handleImageClick(1)}
              cursor="pointer"
            />
            <Image
              objectFit="cover"
              src={imageList[2].url_display}
              alt={`Image 3`}
              border="1px solid #DFE0DC"
              height="calc(33% - 0.67px)"
              width="100%"
              onClick={() => handleImageClick(2)}
              cursor="pointer"
            />
            <Box position="relative" height="calc(33% - 0.67px)">
              <Image
                objectFit="cover"
                src={imageList[3].url_display}
                alt={`Image 4`}
                border="1px solid #DFE0DC"
                height="100%"
                width="100%"
                onClick={() => handleImageClick(3)}
                cursor="pointer"
              />
              {imageCount > 4 && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  w="100%"
                  h="100%"
                  bgColor="black"
                  opacity={0.4}
                  zIndex={1}
                />
              )}
              {imageCount > 4 && (
                <Text
                  position="absolute"
                  bottom="25%"
                  left="47%"
                  transform="translate(-50%, -50%)"
                  color="white"
                  fontSize="35px"
                  fontWeight="500"
                  zIndex={2}
                >
                  +{imageCount - 4}
                </Text>
              )}
            </Box>
          </Box>
        </Flex>
      );
    }
  };

  return (
    <VStack w={"100%"} borderBottom={"1px solid #DFE0DC"} paddingBlock={"10px"}>
      {imageList.length > 0 ? (
        <Box w={"100%"} position="relative">
          {renderimageList(imageList)}
        </Box>
      ) : (
        ""
      )}
      {fileList.length > 0 ? (
        <Box w={"100%"}>
          <RenderFiles files={fileList} detail={false} />
        </Box>
      ) : (
        ""
      )}
    </VStack>
  );
};

export default FileAndPicRender;
