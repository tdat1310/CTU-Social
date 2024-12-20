import {
  Box,
  List,
  ListItem,
  Text,
  Button,
  ListIcon,
  Image,
} from "@chakra-ui/react";
import { MdLabel, MdGroup } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const joinedGroups = []; // Thay đổi thành mảng rỗng để kiểm tra

const LeftContent = () => {
  const data = useSelector((state) => state.auth.userDetail);
  const groups = useSelector((state) => state.group.groups);
  const navigate = useNavigate()
  return (
    <Box h="75vh" position="sticky" top="15%" textAlign="left">
      <Box
        border="1px solid #DFE0DC"
        borderRadius="20px"
        shadow="md"
        bg="white"
        p={4}
      >
        {/* Tag Section */}
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Các tag theo dõi
        </Text>
        {data.TagFollow.length > 0 ? (
          <List spacing={2}>
            {data.TagFollow.slice(0, 5).map((tag) => (
              <ListItem
                key={tag._id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" fontWeight={"400"}>
                  <ListIcon as={MdLabel} color="#2d5be4" boxSize={4} />
                  {tag.TenTag}
                </Box>
                <Text fontSize="sm" color="gray.500">
                  ({tag?.baiDang_id?.length} bài viết)
                </Text>
              </ListItem>
            ))}
          </List>
        ) : (
          <Image
            src="/src/assets/no-data.png"
            alt="No data"
            objectFit={"contain"}
            w="100%"
            h={"170px"}
            borderRadius="10px"
          />
        )}
        <Button
          mt={4}
          w="100%"
          _hover={{
            bg: "#234ca1",
          }}
          bgColor={"#2d5be4"}
          color={"white"}
          onClick={()=>{
            navigate('/account/save')
          }}
        >
          Xem chi tiết
        </Button>
      </Box>

      <Box
        border="1px solid #DFE0DC"
        borderRadius="20px"
        shadow="md"
        bg="white"
        p={4}
        mt={"10px"}
      >
        {/* Joined Groups Section */}
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Nhóm tham gia
        </Text>
        {groups.length > 0 ? (
          <List spacing={2}>
            {groups.slice(0, 3).map((group) => (
              <ListItem
                key={group._id}
                display="flex"
                flexDirection={"column"}
                alignItems="flex-start"
              >
                <Box display="flex" alignItems="center">
                  <ListIcon as={MdGroup} color="#2d5be4" boxSize={5} />
                  {group.TenNhom}
                </Box>
                <Text fontSize="sm" color="gray.500">
                  ({group.ThanhVien.length} thành viên)
                </Text>
              </ListItem>
            ))}
          </List>
        ) : (
          <Image
            src="/src/assets/no-data.png"
            alt="No data"
            h={"170px"}
            objectFit={"contain"}
            w="100%"
            borderRadius="10px"
          />
        )}
        <Button
          mt={4}
          w="100%"
          _hover={{
            bg: "#234ca1",
          }}
          bgColor={"#2d5be4"}
          color={"white"}
          onClick={()=>{
            navigate('/group')
          }}
        >
          Xem chi tiết
        </Button>
      </Box>
    </Box>
  );
};

export default LeftContent;
