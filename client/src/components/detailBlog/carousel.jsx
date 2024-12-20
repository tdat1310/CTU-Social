import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  IconButton,
  useBreakpointValue,
  Image,
  HStack,
  Card,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import Slider from "react-slick";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const settings = {
  arrows: false,
  infinite: true,
  speed: 1,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

const Carousel = ({ listImg, role, handleCreatePostClick, index, loading, deleteHandle }) => {
  const [slider, setSlider] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(index || 0);
  const side = useBreakpointValue({ base: "30px", md: "40px" });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    onOpen();
  };

  const handleThumbnailClick = (index) => {
    slider.slickGoTo(index);
    setCurrentSlide(index);
  };

  const getThumbnails = () => {
    const startIndex = Math.max(0, currentSlide - 1);
    const endIndex = Math.min(startIndex + 3, listImg?.length);
    return listImg?.slice(startIndex, endIndex);
  };

  return (
    <>
      <Card
        position="relative"
        overflow="hidden"
        h={"84%"}
        maxW="900px"
        w={"900px"}
        shadow={"md"}
      >
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />

        <IconButton
          aria-label="left-arrow"
          variant="ghost"
          position="absolute"
          left={side}
          top="50%"
          transform="translate(0%, -50%)"
          zIndex={2}
          onClick={() => slider && slider.slickPrev()}
        >
          <BiLeftArrowAlt size="40px" />
        </IconButton>

        <IconButton
          aria-label="right-arrow"
          variant="ghost"
          position="absolute"
          right={side}
          top="50%"
          transform="translate(0%, -50%)"
          zIndex={2}
          onClick={() => slider && slider.slickNext()}
        >
          <BiRightArrowAlt size="40px" />
        </IconButton>
        {role === "user" ? (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="more options"
              variant="ghost"
              position="absolute"
              top={"10px"}
              right={"10px"}
              p={"10px"}
              zIndex={2}
            >
              <BsThreeDots size="30px" />
            </MenuButton>
            <MenuList border="1px solid #DFE0DC">
              <MenuItem onClick={handleCreatePostClick}>Sửa bài viết</MenuItem>
              <MenuItem onClick={deleteHandle}>
                Xóa bài viết
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          ""
        )}
        <Slider
          {...settings}
          ref={(slider) => setSlider(slider)}
          afterChange={(index) => setCurrentSlide(index)}
        >
          {listImg?.map((image, index) => (
            <Flex key={index} height="450px"  position={'relative'}>
              <Image
                cursor="pointer"
                src={image.url_display}
                objectFit="contain"
                boxSize={'450px'}
                width="70%"
                borderRadius={"10px"}
                // border="3px solid #DFE0DC"
                left={'15.6%'}
                // top={'20%'}
                // shadow={'lg'}
                position={'absolute'}
                onClick={() => handleImageClick(image.url_display)}
              />
            </Flex>
          ))}
        </Slider>

        <HStack spacing={2} mt={4} justify="center">
          {getThumbnails().length > 0 &&
            !getThumbnails().includes(listImg[0]) && (
              <MotionBox
                borderWidth="1px"
                borderRadius="md"
                height="100px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgColor="gray.100"
                border="1px solid #DFE0DC"
                w={"105px"}
              >
                <HiDotsHorizontal style={{ fontSize: "25px" }} />
              </MotionBox>
            )}
          {getThumbnails().map((image, index) => (
            <MotionBox
              key={index}
              borderWidth={
                currentSlide === listImg.indexOf(image) ? "2px" : "1px"
              }
              borderColor={
                currentSlide === listImg.indexOf(image)
                  ? "blue.500"
                  : "gray.200"
              }
              cursor="pointer"
              onClick={() => handleThumbnailClick(listImg.indexOf(image))}
              borderRadius="md"
              border={"1px solid #DFE0DC"}
              shadow={'md'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={
                currentSlide === listImg.indexOf(image)
                  ? { scale: 1.1 }
                  : { scale: 1 }
              }
              transition={{ duration: 0.2 }}
              height="100px"
            >
              <Image
                src={image.url_display}
                 boxSize="90px"
                
                 h={'100%'}
                objectFit="cover"
               
              />
            </MotionBox>
          ))}
          {getThumbnails()?.length > 0 &&
            !getThumbnails().includes(listImg[listImg.length - 1]) && (
              <MotionBox
                borderWidth="1px"
                borderRadius="md"
                height="100px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgColor="gray.100"
                border="1px solid #DFE0DC"
                w={"105px"}
              >
                <HiDotsHorizontal style={{ fontSize: "25px" }} />
              </MotionBox>
            )}
        </HStack>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent position="absolute" >
          <ModalBody p={0} bg={"transparent"}>
            <Image
              src={selectedImage}
              objectFit="contain"
              bg={"transparent"}
              w="100%"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Carousel;
