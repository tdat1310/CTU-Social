import { Flex, Spinner } from "@chakra-ui/react";
const spinner = () => {
  return (
    <>
      <Flex
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        backgroundColor="rgba(255, 255, 255, 0.8)"
        zIndex="overlay"
      >
        <Spinner
          size="xl"
          emptyColor="gray.200"
          thickness="5px"
          speed="0.65s"
          color="blue.500"
        />
      </Flex>
    </>
  );
};

export default spinner;
