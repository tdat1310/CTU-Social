import {
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  Text,
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import Brand from "../common/brand";
import { UserApi } from "../../apis/userApi";
const SignUp = ({ auth, authSwitch }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    userName: "",
    email: "",
    userPassword: "",
  });
  const toast = useToast();
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    userPassword: "",
  });

  const handleClick = () => setShow(!show);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    if (
      name === "email" &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Sai định dạng email",
      }));
    } else if (name === "userPassword" && value.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Mật khẩu phải ít nhất 8 kí tự",
      }));
    } else if (value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Không được bỏ trống",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };
  const handleSubmit = async () => {
    const newErrors = {};
    if (data.userName.trim() === "") {
      newErrors.userName = "Không được bỏ trống";
    }
    if (data.email.trim() === "") {
      newErrors.email = "Không được bỏ trống";
    }
    if (data.userPassword.trim() === "") {
      newErrors.userPassword = "Không được bỏ trống";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const res = await UserApi.createNewUser("auth/register", data);
        if (res.error) {
          setLoading(false);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [res.error.type]: res.error.des,
          }));
        } else {
          setLoading(false);
          console.log(res);
          toast({
            title: "Đăng ký thành công",
            description: "Vui lòng đăng nhập để truy cập vào trang web",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });

          setTimeout(() => {
            authSwitch("L");
          }, 2000);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Stack
      w="40%"
      h="100%"
      overflow="auto"
      display={auth === "L" ? "none" : "block"}
    >
      <Flex h="100%" alignItems="center" justifyContent="center">
        <Flex flexDirection="column" p={12} w="450px">
          <Brand />
          <Heading textAlign="center" mb={6} mt={2}>
            Đăng ký
          </Heading>
          <FormControl mb={3}>
            <FormLabel htmlFor="username" mb="0">
              Tên tài khoản
            </FormLabel>
            <Input
              id="username"
              placeholder="Tên tài khoản"
              name="userName"
              value={data.userName}
              onChange={handleInputChange}
              borderColor={errors.userName ? "red.500" : "gray.300"}
            />
            {errors.userName && (
              <Text color="red.500" fontSize="sm">
                {errors.userName}
              </Text>
            )}
          </FormControl>

          <FormControl mb={3}>
            <FormLabel htmlFor="email" mb="0">
              Email
            </FormLabel>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleInputChange}
              borderColor={errors.email ? "red.500" : "gray.300"}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email}
              </Text>
            )}
          </FormControl>

          <FormControl mb={6}>
            <FormLabel htmlFor="password" mb="0">
              Password
            </FormLabel>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Mật khẩu"
                name="userPassword"
                value={data.userPassword}
                onChange={handleInputChange}
                borderColor={errors.userPassword ? "red.500" : "gray.300"}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.userPassword && (
              <Text color="red.500" fontSize="sm">
                {errors.userPassword}
              </Text>
            )}
          </FormControl>
          {loading ? (
            <Flex w={"100%"} mb={"5px"} justifyContent={"center"}>
              <Spinner color="blue.500" thickness="4px" size="lg" />
            </Flex>
          ) : (
            <Button
              bg={"#2d5be4"}
              _hover={{
                bg: "#1a409f ",
              }}
              color={"white"}
              mb={8}
              onClick={handleSubmit}
            >
              Đăng ký
            </Button>
          )}
          <Box
            sx={{
              display: "flex",
              gap: "10px",
            }}
            mt="12px"
          >
            <RiAccountCircleLine
              fontSize="30px"
              style={{ marginTop: "-2px" }}
            />
            <Text
              fontWeight="500"
              _hover={{
                textDecoration: "underline",
                cursor: "pointer",
                transition: "0.1s",
              }}
              onClick={authSwitch}
            >
              Đăng nhập ?
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default SignUp;
