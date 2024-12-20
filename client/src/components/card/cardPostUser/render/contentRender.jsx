import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  CardBody,
  HStack,
  Button,
} from "@chakra-ui/react";
import { FaHashtag } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllPostByTagId } from "../../../../Redux/slices/tagSlice";
const ContentRender = ({ blogData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const maxContentHeight = 150; // Maximum height before showing "Xem thêm"
  const navigate = useNavigate();
  const dispatch = useDispatch()
  useEffect(() => {
    if (contentRef.current) {
      // Check if the content height exceeds the max height
      setIsOverflowing(contentRef.current.scrollHeight > maxContentHeight);
    }
  }, [blogData.content]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <CardBody>
      <Box>
        {blogData.Tags.length > 0 && (
          <HStack spacing={3} color={'#2d5be4'}>
            {blogData.Tags.map((tag, index) => (
              <Flex
                fontWeight={500}
                key={index}
                _hover={{
                  textDecoration: "underline",
                }}
                cursor={"pointer"}
                onClick={() => {
                  // dispatch(getAllPostByTagId(`posts/postByTag/${tag._id}?post=${3}`));
                  navigate(`/tags/${tag.TenTag}/${tag._id}`);
                }}
              >
                <FaHashtag style={{ marginTop: "7px" }} />
                <Text fontSize={"19px"}>{tag.TenTag}</Text>
              </Flex>
            ))}
          </HStack>
        )}
        <Heading size="md" fontSize={"25px"} mt={"10px"}>
          {blogData.title}
        </Heading>
      </Box>

      <Box
        mt={"20px"}
        maxH={isExpanded ? "none" : `${maxContentHeight}px`}
        overflow="hidden"
        position="relative"
        ref={contentRef}
      >
        <Box
          dangerouslySetInnerHTML={{ __html: blogData.content }}
          maxH={isExpanded ? "none" : `${maxContentHeight}px`}
        />
        {isOverflowing && !isExpanded && (
          <Box
            position="absolute"
            left={0}
            right={0}
            bottom={0}
            height="50px"
            background="linear-gradient(to top, white, rgba(255, 255, 255, 0))"
          />
        )}
      </Box>

      {isOverflowing && (
        <Button
          mt={"10px"}
          onClick={toggleExpand}
          colorScheme="blue"
          variant="link"
        >
          {isExpanded ? "Thu gọn" : "Xem thêm"}
        </Button>
      )}
    </CardBody>
  );
};

export default ContentRender;
