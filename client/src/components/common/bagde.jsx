import { Badge, Text } from '@chakra-ui/react'
import React from 'react'
const BagdeCustom = ({Num, top, right}) => {
  return (
    <Badge
    position="absolute" 
    top={top} 
    right={right} 
    colorScheme="red" 
    variant="solid" 
    rounded="full"
    py={'1.5px'}
    px={'6.5px'}
    textAlign="center"
    justifyContent={'center'}
  >
    <Text>{Num}</Text>
  </Badge>
  )
}

export default BagdeCustom