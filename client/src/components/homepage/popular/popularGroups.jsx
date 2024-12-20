

import {
  Box,
  Container,
  Flex,
  Heading,
  Stack,
} from '@chakra-ui/react'
import GroupCard from '../../card/groupCard'

const PopularGroups = () => {
  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'}>
          Cộng đồng sinh viên
        </Heading>
      </Stack>
      <Container maxW={'5xl'} mt={12}>
        <Flex flexWrap="wrap" gridGap={6} justify="center">
          <GroupCard
            heading={'Toán rời rạc'}
            description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
          />
          <GroupCard
            heading={'Toán rời rạc'}
            description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
          />
          <GroupCard
            heading={'Toán rời rạc'}
            description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
          />
        </Flex>
      </Container>
    </Box>
  )
}

export default PopularGroups
