import React from 'react'
import {Box, Text} from "@chakra-ui/react";
const LayerMorePic = ({images, onOpen}) => {
  return (
    <Box
     onClick={()=>onOpen()}
      height="100%"
      width="100%"
      cursor={'pointer'}
    >
    <Box
      position="absolute"
      top="0"
      left="0"
      height="100%"
      width="100%"
      opacity={0.8}
      bg="gray.500"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="10px" 
      >
      </Box>
      <Text position={'absolute'}   top="45%"
      left="45%" color="white" fontSize="18px" fontWeight={'500'}>+{images.length - 3}</Text>
    </Box>
  )
}

export default LayerMorePic