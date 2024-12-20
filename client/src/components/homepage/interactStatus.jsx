import { HStack, Text, Flex} from '@chakra-ui/react'
import React from 'react'
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { MdBookmarkBorder } from "react-icons/md";
const InteractStatus = () => {
  return (
    <HStack fontWeight={'500'}w={'196px'}spacing={3} fontSize={'16px'} marginTop={'15px'} display={'flex'} justifyContent={'right'}>
        <Flex gap={'5px'}>
        <Text >100</Text>
        <FaRegHeart style={{marginTop: '5px', color: 'red'}}/>
        </Flex>
        <Flex gap={'5px'}>
        <Text>100</Text>
        <FaRegComment style={{marginTop: '4px', color: '#4785c1'}}/>
        </Flex>
        <Flex gap={'2px'}>
        <Text>100</Text>
        <MdBookmarkBorder style={{marginTop: '5px', color: 'blueviolet'}}/>
        </Flex>
    </HStack>
  )
}

export default InteractStatus