import { Img, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
const Brand = () => {
  return (
    <Link to={"/"} style={{ border: "none" }}>
      <Stack direction={["column", "row"]}>
        <Img
         w={'200px'}
          src={"/src/assets/logo.png"}
        ></Img>
        {/* <Text fontSize="24px" fontWeight="900" mt="10px" color={'white'}>
          CTU Social
        </Text> */}
      </Stack>
    </Link>
  );
};

export default Brand;
