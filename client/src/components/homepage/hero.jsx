import {
  Flex,
  Heading,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import MovingText from "react-moving-text";
const Hero = ({loadingHandle}) => {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }} >
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <MovingText
               type="fadeIn"
               duration="900ms"
               delay="0s"
               direction="normal"
               timing="ease"
               iteration="1"
               fillMode="none"
            >
             CTU Social
            </MovingText>
            <Text color={"#2d5be4"} as={"span"}>
             Mạng xã hội học tập
            </Text>{" "}
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
            Trang web mang đến lợi ích cho người dùng, cụ thể là giúp sinh viên tương
            tác với nhau một cách dễ dàng hơn
          </Text>
        </Stack>
      </Flex>
      <Flex flex={1} bg={'#2d5be4'}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={"/src/assets/home-pic.png"}
          onLoad={loadingHandle}
        />
      </Flex>
    </Stack>
  );
};
export default Hero;
