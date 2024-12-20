import {
  Box,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRegPenToSquare } from "react-icons/fa6";
const TagCard = ({ title, stat }) => {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      border="1px solid #DFE0DC"
      rounded={"lg"}
    >
      <Flex justifyContent={"space-between"} gap={"15px"}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={"medium"} isTruncated>
            <Text fontSize={"18px"} fontWeight={"600"} color={"blue.500"}>
              <span style={{ fontSize: "25px" }}>#</span>
              {title}
            </Text>
          </StatLabel>
          <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
            {stat} bài viết
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent={"center"}
        >
          <FaRegPenToSquare size={"3em"} />
        </Box>
      </Flex>
    </Stat>
  );
};

export default TagCard;
