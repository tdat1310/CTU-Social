import {
    Box,
    Flex, 
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { FaUser, FaLock } from 'react-icons/fa';
  import { Link } from 'react-router-dom'
  const AuthNavbar = () => {
    return (
      <Box px={4}>
        <Flex h={16} justifyContent={'flex-end'} alignItems={'center'}>
          <Flex gap={'10px'} p={5}>
            <Link
              to={'/auth/S'}
            >
              <Box 
               px={3}
               py={2}
               rounded={'md'}
               display='flex'
               justifyContent='center'
               gap='15px'
               _hover={{
                 textDecoration: 'none',
                 bg: '#2346b4',
               }}
               flexGrow={1}
              >
              <FaUser style={{marginTop: '2px'}}/>
               <Text>Đăng ký</Text>
              </Box>
            </Link>
            <Link
              to={'/auth/L'} // thêm thuộc tính flexGrow
            >
              <Box 
               px={3}
               py={2}
               rounded={'md'}
               display='flex'
               justifyContent='center'
               gap='15px'
               _hover={{
                textDecoration: 'none',
                bg: '#2346b4',
              }}
               flexGrow={1}
              >
              <FaLock style={{marginTop: '2px'}}/>
               <Text>Đăng nhập</Text>
              </Box>
            </Link>
          </Flex>
        </Flex>
      </Box>
    );
  };
  
  export default AuthNavbar;