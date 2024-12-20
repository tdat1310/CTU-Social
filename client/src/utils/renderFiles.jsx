import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PiDownloadSimpleBold } from "react-icons/pi"; // Ensure you import this icon correctly
import GetIconByMimeType from "./GetIconByMimeType";

const RenderFiles = ({ files, detail }) => {
  return (
    <Flex
      mt={detail ? 1 : 4}
      paddingInline={"5px"}
      wrap="wrap"
      w={"100%"}
      flex={1}
      justify="flex-start"
      alignItems="center"
    >
      {files.map((file, index) => (
        <Flex
          key={index}
          alignItems="center"
          bg="white"
          p={2}
          borderRadius="md"
          m={1}
          w={"160px"}
          sx={{
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
              transform: "scale(1.02)",
            },
          }}
          gap={2}
        >
          <Box fontSize="20px" color="gray.600">
            <GetIconByMimeType mimeType={file.mimeType} />
          </Box>
          <Text
            fontSize="14px"
            fontWeight="500"
            flex="1"
            maxWidth="100px"
            isTruncated
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {file.name}
          </Text>
          <Link to={file.url_download}>
            <Box fontSize="18px" color="gray.600" >
              <PiDownloadSimpleBold style={{ cursor: "pointer" }} />
            </Box>
          </Link>
        </Flex>
      ))}
    </Flex>
  );
};

export default RenderFiles;