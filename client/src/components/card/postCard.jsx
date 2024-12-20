"use client";

import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Image,
  HStack,
} from "@chakra-ui/react";
import InteractStatus from "../homepage/interactStatus";
import { Link } from "react-router-dom";
import Tag from "../Modal/input/tag";
const PostCard = () => {
  return (
    <Center py={6}>
      <Box
        maxW={"445px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        rounded={"md"}
        border="1px solid #DFE0DC"
        p={6}
        overflow={"hidden"}
      >
        <Link>
          <Box
            h={"210px"}
            bg={"gray.100"}
            mt={-6}
            mx={-6}
            mb={6}
            pos={"relative"}
          >
            <Image
              src={
                "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              }
              alt="Example"
              objectFit="cover"
              w="full"
              h="full"
            />
          </Box>
          <Stack>
            <HStack>
              <Tag text="Blog" />
              <Tag text="Blog" />
              <Tag text="Blog" />
              <Tag text="Blog" />
            </HStack>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"2xl"}
              fontFamily={"body"}
            >
              Boost your conversion rate
            </Heading>
          </Stack>
        </Link>
        <Stack
          mt={6}
          direction={"row"}
          spacing={4}
          display={"flex"}
          justifyContent={"space-between"}
        >
          <HStack spacing={"30px"}>
            <Link>
              <HStack>
                <Avatar
                  src={"https://avatars0.githubusercontent.com/u/1164541?v=4"}
                />
                <Stack direction={"column"} spacing={0} fontSize={"sm"}>
                  <Text fontWeight={600}>Achim Rolle</Text>
                  <Text color={"gray.500"}>Feb 08, 2021</Text>
                </Stack>
              </HStack>
            </Link>
            <Link>
              <InteractStatus />
            </Link>
          </HStack>
        </Stack>
      </Box>
    </Center>
  );
};

export default PostCard;
