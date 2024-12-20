import {
  List,
  ListItem,
  ListIcon,
  Text,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  VStack,
} from "@chakra-ui/react";
import {
  MdPeople,
  MdPeopleOutline,
  MdPostAdd,
  MdThumbUp,
} from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { IoMdSchool } from "react-icons/io";

const RightContent = ({ data }) => {
  const userData = data.user || data; // Sử dụng `data.user` nếu có, nếu không thì dùng `data`
  console.log(userData)
  const {
    isOpen: isFollowerOpen,
    onOpen: onFollowerOpen,
    onClose: onFollowerClose,
  } = useDisclosure();
  const {
    isOpen: isFollowingOpen,
    onOpen: onFollowingOpen,
    onClose: onFollowingClose,
  } = useDisclosure();

  // Tính tổng số lượt thích
  const totalLikes =
    userData?.BaiDang?.reduce((total, item) => {
      return total + (item?.LikedBy?.length || 0);
    }, 0) || 0;

  return (
    <>
      <Flex
        h="340px"
        color="black"
        position="sticky"
        top="15%"
        direction={"column"}
        gap={"15px"}
      >
        <List
          spacing={3}
          p={4}
          bg={"white"}
          border={"1px solid #DFE0DC"}
          shadow={"md"}
          borderRadius={"20px"}
        >
          <ListItem fontWeight={800}>Học vấn</ListItem>
          <ListItem>
            <ListIcon as={PiStudentBold} fontSize={"18px"} />
            Khóa:{" "}
            <Text as="span" fontWeight="600">
              {userData.Khoa || "Chưa cập nhật"}
            </Text>
          </ListItem>
          <ListItem>
            <ListIcon as={IoMdSchool} fontSize={"18px"} />
            Chuyên ngành:{" "}
            <Text fontWeight="600">
              {userData.ChuyenNganh || "Chưa cập nhật"}
            </Text>
          </ListItem>
        </List>
        <List
          spacing={3}
          p={4}
          bg={"white"}
          border={"1px solid #DFE0DC"}
          shadow={"md"}
          borderRadius={"20px"}
        >
          <ListItem fontWeight={800}>Thông tin</ListItem>
          <ListItem>
            <Flex align="center" onClick={onFollowerOpen} cursor={"pointer"}>
              <ListIcon as={MdPeople} fontSize={"18px"} />
              Người theo dõi:{" "}
              <Text as="span" fontWeight="600" ml={2}>
                {userData?.NguoiTheoDoi?.length || 0}
              </Text>
              {/* <Button size="xs" ml={4} onClick={onFollowerOpen}>
                Xem
              </Button> */}
            </Flex>
          </ListItem>
          <ListItem>
            <Flex align="center" onClick={onFollowingOpen} cursor={"pointer"}>
              <ListIcon as={MdPeopleOutline} fontSize={"18px"} />
              Đang theo dõi:{" "}
              <Text as="span" fontWeight="600" ml={2}>
                {userData?.TheoDoi?.length || 0}
              </Text>
              {/* <Button size="xs" ml={4} onClick={onFollowingOpen}>
                Xem
              </Button> */}
            </Flex>
          </ListItem>
          <ListItem>
            <ListIcon as={MdPostAdd} fontSize={"18px"} />
            Số bài viết:{" "}
            <Text as="span" fontWeight="600">
              {userData?.BaiDang?.length || 0}
            </Text>
          </ListItem>
          <ListItem>
            <ListIcon as={MdThumbUp} fontSize={"18px"} />
            Số lượt thích:{" "}
            <Text as="span" fontWeight="600">
              {totalLikes}
            </Text>
          </ListItem>
        </List>
      </Flex>

      {/* Modal Người Theo Dõi */}
      <Modal isOpen={isFollowerOpen} onClose={onFollowerClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Người theo dõi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={3}
              align="start"
              h={"400px"}
              maxH={"400px"}
              overflow={"auto"}
            >
              {userData?.NguoiTheoDoi?.length > 0 ? (
                userData?.NguoiTheoDoi.map((follower, index) => (
                  <Flex key={index} alignItems={"center"} gap={"10px"}>
                    <Avatar
                      src={
                        follower.avtPic
                          ? follower.avtPic.display_url
                          : "/src/assets/no-avt.png"
                      }
                    />
                    <Text key={index}>{follower.userName}</Text>
                  </Flex>
                ))
              ) : (
                <Text>Không có người theo dõi.</Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Đang Theo Dõi */}
      <Modal isOpen={isFollowingOpen} onClose={onFollowingClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Đang theo dõi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={3}
              align="start"
              h={"400px"}
              maxH={"400px"}
              overflow={"auto"}
            >
              {userData?.TheoDoi?.length > 0 ? (
                userData?.TheoDoi.map((following, index) => (
                  <Flex key={index} alignItems={"center"} gap={"10px"}>
                    <Avatar
                      src={
                        following.avtPic
                          ? following.avtPic.display_url
                          : "/src/assets/no-avt.png"
                      }
                    />
                    <Text key={index}>{following.userName}</Text>
                  </Flex>
                ))
              ) : (
                <Text>Không theo dõi ai.</Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RightContent;
