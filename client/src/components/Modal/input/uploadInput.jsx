/* eslint-disable react-hooks/exhaustive-deps */
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  forwardRef,
  Heading,
  Input,
  Stack,
  Text,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Img,
  useDisclosure,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { memo, useEffect, useState } from "react";
import PicWrap from "./picWrap";
import LayerMorePic from "./layerMorePic";
import PicModal from "../picModal";
const variants = {
  first: {
    rest: {
      rotate: "-15deg",
      scale: 0.95,
      x: "-50%",
      filter: "grayscale(80%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn",
      },
    },
    hover: {
      x: "-70%",
      scale: 1.1,
      rotate: "-20deg",
      filter: "grayscale(0%)",
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut",
      },
    },
  },
  second: {
    rest: {
      rotate: "15deg",
      scale: 0.95,
      x: "50%",
      filter: "grayscale(80%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn",
      },
    },
    hover: {
      x: "70%",
      scale: 1.1,
      rotate: "20deg",
      filter: "grayscale(0%)",
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut",
      },
    },
  },
  third: {
    rest: {
      scale: 1.1,
      filter: "grayscale(80%)",
      transition: {
        duration: 0.5,
        type: "tween",
        ease: "easeIn",
      },
    },
    hover: {
      scale: 1.3,
      filter: "grayscale(0%)",
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut",
      },
    },
  },
};

const PreviewImage = forwardRef((props, ref) => {
  return (
    <Box
      bg="white"
      top="0"
      height="100%"
      width="100%"
      position="absolute"
      borderWidth="1px"
      borderStyle="solid"
      rounded="sm"
      borderColor="gray.400"
      as={motion.div}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      {...props}
      ref={ref}
    />
  );
});
const UploadInput = memo(({ setData, editImageList, editMode }) => {
  //console.log(editImageList)
  const controls = useAnimation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const startAnimation = () => controls.start("hover");
  const stopAnimation = () => controls.stop();
  const [images, setImages] = useState(editImageList || []);
  const [imgFile, setImgFile] = useState([]);
  useEffect(() => {
    editMode
      ? setData((prevData) => ({ ...prevData, images_update: imgFile }))
      : setData((prevData) => ({ ...prevData, images: imgFile }));
  }, [imgFile]);
  const addImage = (url, file) => {
    setImages([...images, url]);
    setImgFile(() => {
      return [...imgFile, file];
    });
  };

  const removeImage = (index) => {
    setImages(
      images.filter((_, i) => {
        return i !== index;
      })
    );
    const newIndex = editMode ? index - editImageList.length : index;
    if (index < editImageList.length && editMode) {
      setData((prevData) => ({
        ...prevData,
        images: editImageList.filter((_, i) => i !== index),
      }));
    } else {
      setImgFile(() => {
        const picList = imgFile.filter((_, i) => i !== newIndex);
        return picList;
      });
    }
  };
  const handlePicChange = (event) => {
    const file = event.target.files[0];
    //  console.log(file);
    if (!file) return; // Nếu không có file thì không làm gì cả

    const reader = new FileReader();
    reader.onload = (e) => {
      addImage(e.target.result, file);
      event.target.value = ""; // Xóa giá trị của input
      event.target.blur();
    };
    reader.readAsDataURL(file);
  };
  return (
    <FormControl id="title">
      <Flex gap={"200px"}>
        <FormLabel>Tải ảnh lên</FormLabel>
        {images.length > 0 ? (
          <FormLabel position={"relative"} top={"40px"} right={"13px"}>
            Danh sách ảnh
          </FormLabel>
        ) : (
          ""
        )}
      </Flex>
      <HStack spacing={"20px"}>
        <Stack ml={"0"} my={"10px"}>
          <AspectRatio width="64" ratio={1}>
            <Box
              borderColor="gray.300"
              borderStyle="dashed"
              borderWidth="2px"
              rounded="md"
              shadow="sm"
              role="group"
              transition="all 150ms ease-in-out"
              _hover={{ shadow: "md" }}
              as={motion.div}
              initial="rest"
              animate="rest"
              whileHover="hover"
            >
              <Box position="relative" height="100%" width="100%">
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  height="100%"
                  width="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <Stack
                    height="100%"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justify="center"
                    spacing="4"
                  >
                    <Box height="16" width="12" position="relative">
                      <PreviewImage
                        variants={variants.first}
                        backgroundImage="url('https://e1.pxfuel.com/desktop-wallpaper/319/0/desktop-wallpaper-5-iphone-lock-screen-blurry-blur-iphone.jpg')"
                      />

                      <PreviewImage
                        variants={variants.second}
                        backgroundImage="url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7b6N8zv_loGkUgFLrQ4xVD21FwNBXvZEQ7eYoZleNk3Xu8F-d8vfzOKd0EkwkwlWLSiA&usqp=CAU')"
                      />

                      <PreviewImage
                        variants={variants.third}
                        backgroundImage="url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRByH1Gd637qsCrO2y_x3doZKwAh8kUkNkwiw&s')"
                      />
                    </Box>
                    <Stack p="8" textAlign="center" spacing="1">
                      <Heading fontSize="lg" fontWeight="bold">
                        Kéo ảnh vào
                      </Heading>
                      <Text>Hoặc nhấn để tải lên</Text>
                    </Stack>
                  </Stack>
                </Box>
                <Input
                  type="file"
                  height="100%"
                  width="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  aria-hidden="true"
                  accept="image/*"
                  onChange={handlePicChange}
                  onDragEnter={startAnimation}
                  onDragLeave={stopAnimation}
                />
              </Box>
            </Box>
          </AspectRatio>
        </Stack>
        <HStack>
          {images.slice(0, 3).map((img, key) => (
            <Box position="relative" key={key}>
              <PicWrap src={img} onDelete={removeImage} id={key} />
              {key === 2 && images.length > 3 && (
                <LayerMorePic images={images} onOpen={onOpen} />
              )}
            </Box>
          ))}
        </HStack>
        {images.length > 0 ? (
          <PicModal
            onClose={onClose}
            isOpen={isOpen}
            items={images}
            onDelete={removeImage}
          />
        ) : (
          ""
        )}
      </HStack>
    </FormControl>
  );
});
UploadInput.displayName = "UploadInput";
export default UploadInput;
