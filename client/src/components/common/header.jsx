import { Box, Flex, Heading, useColorMode, HStack } from "@chakra-ui/react";
import Brand from "./brand";
import SearchBar from "./searchBar";
import HomeNavbar from "../navbar/homeNavbar";
import { useSelector } from "react-redux";
import AuthNavbar from "../navbar/authNavbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Header = ({onSearch}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const userDetail = useSelector((state) => state.auth.userDetail);
  const navigate =  useNavigate()
  useEffect(()=>{
    if(userDetail==null){
      navigate("/")
    }
  },[navigate, userDetail])
  return (
    <Box
      as="header"
      py={4}
      px={5}
      bg={colorMode === "light" ? "#2d5be4" : "gray.800"}
      position="sticky"
      top={0}
      zIndex={99}
      color={'#e5f8ff'}
      w={"100%"}
      shadow={'lg'}
    >
      <Flex justify="space-between" align="center">
        <Box flex="1 1 20%">
          <Heading
            as="h1"
            size="lg"
            color={colorMode === "light" ? "gray.800" : "white"}
          >
            <Brand />
          </Heading>
        </Box>
        <Box flex="1 1 41%">
         {userDetail && <SearchBar onSearch={onSearch}/>} 
        </Box>
        <HStack flex="1 1 39%" justifyContent={ userDetail ? "center" : 'right'}>
          {userDetail ? (
            <HomeNavbar
              toggleColorMode={toggleColorMode}
              colorMode={colorMode}
              userDetail={userDetail}
            />
          ) : (
            <AuthNavbar />
          )}
        </HStack>
      </Flex>
   
    </Box>
  );
};

export default Header;
