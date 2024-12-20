import React from "react";
import { Box, Text, VStack, Button, Flex } from "@chakra-ui/react";
import AvatarItem from "./avatarItem";

const ListSection = ({ title, items, LeftSection, type }) => {
  return (
    <Box
      h={type == "user" ? "250px" : "260px"}
      bg="gray.50"
      shadow="md"
      w={"120%"}
      p={5}
      border="1px solid #DFE0DC"
      borderRadius="20px"
    >
      <Flex justifyContent={'space-between'} alignContent={'center'} mb={'20px'} fontSize={'15px'}>
        <Text fontWeight="bold" >
          {title}
        </Text>
        {/* <Button variant={"link"} >Xem tất cả</Button> */}
      </Flex>
      <VStack align="start">
        {items.slice(0,3).map((item) => (
          <Box key={item._id} w={"100%"}>
            <AvatarItem item={item} leftSection={LeftSection} type={type} />
          </Box>
        ))}
      </VStack>
      {!LeftSection && (
        <Box w={"100%"}>
          <Button mt={"10px"} variant={"link"}>
            Xem tất cả
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ListSection;
