import {
  Box,
  chakra,
  SimpleGrid,
} from '@chakra-ui/react';
import TagCard from '../../card/tagCard';

const PopularTags = () => {
  return (
    <Box w="100%" mx={'auto'} py={5} px={{ base: 2, sm: 12, md: 17 }} border='1px solid #eeeeee' >
      <chakra.h1 textAlign={'left'} ml={'5px'}fontSize={'4xl'} py={10} fontWeight={'bold'}>
        Các tag nổi bật
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <TagCard title={'Users'} stat={'500'} />     
        <TagCard title={'Users'} stat={'500'} />     
        <TagCard title={'Users'} stat={'500'} />     
        <TagCard title={'Users'} stat={'500'} />     
        <TagCard title={'Users'} stat={'500'} />     
        <TagCard title={'Users'} stat={'500'} />     
      </SimpleGrid>
    </Box>
  );
};

export default PopularTags;
