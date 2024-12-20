import {
  Box,
  Button,
  Heading,
  Flex,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

const GroupCard = ({ heading, description, picUrl }) => {
  return (
    <Box
      maxW={{ base: "full", md: "275px" }}
      w={"full"}
      borderWidth="1px"
      borderRadius="10px"
      overflow="hidden"
      border="1px solid #DFE0DC"
      p={5}
    >
      <Stack align={"start"} spacing={2}>
        <Box mt={2}>
          <Box
            h={"120px"}
            bg={"gray.100"}
            mt={-10}
            mx={-6}
            mb={6}
            pos={"relative"}
          >
            <Image
              src={
                picUrl
                  ? ""
                  : "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              }
              alt="Example"
              objectFit="cover"
              w="full"
              h="full"
            />
          </Box>
          <Heading size="md">{heading}</Heading>
          <Text mt={1} fontSize={"sm"} h={"42px"} noOfLines={2}>
            {description}
          </Text>
        </Box>
        <Flex justifyContent={"space-between"} w={"100%"}>
          <Button variant={"link"} colorScheme={"blue"} size={"sm"}>
            Tham gia
          </Button>
          <Text fontSize={"small"} fontWeight={"500"}>
            500 Thành viên
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
};
export default GroupCard;
