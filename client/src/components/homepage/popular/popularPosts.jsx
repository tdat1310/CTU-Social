import { Box, Heading, HStack, VStack } from '@chakra-ui/react'
import React from 'react'
import PostCard from '../../card/postCard'
const PopularPosts = () => {
  return (
    <Box as="section" py={8} px={'10px'} border='1px solid #eeeeee'>
    <VStack align="stretch" spacing={4}>
      <Heading ml={'20px'} as="h2" size="lg" color="gray.800">
        Bài đăng phổ biến
      </Heading>
      <HStack align={'stretch'} display={'flex'} justifyContent={'space-evenly'}>
        <PostCard/>
        <PostCard/>
        <PostCard/>
      </HStack>
    </VStack>
  </Box>
  )
}

export default PopularPosts