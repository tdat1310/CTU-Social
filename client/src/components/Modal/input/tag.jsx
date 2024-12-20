import { Text } from '@chakra-ui/react';

const Tag = ({ text }) => {
  return (
    <Text
      color={'blue.500'}
      textTransform={'uppercase'}
      fontWeight={800}
      fontSize={'sm'}
      letterSpacing={1.1}
    >
      <span style={{ fontSize: '18px' }}>#</span>
      {text}
    </Text>
  );
};

export default Tag;
