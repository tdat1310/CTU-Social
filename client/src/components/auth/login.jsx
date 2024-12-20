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
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiAccountCircleLine } from "react-icons/ri";
import Brand from "../common/brand";
import { loginUserAndSave } from "../../Redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = ({ auth, authSwitch }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.auth.userDetail);
  const loading = useSelector((state) => state.auth.loading);
  const [data, setData] = useState({
    email: "",
    userPassword: "",
  });
  const toast = useToast();
  const [errors, setErrors] = useState({
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
    if (data.email.trim() === "") {
      newErrors.email = "Không được bỏ trống";
    }
    if (data.userPassword.trim() === "") {
      newErrors.userPassword = "Không được bỏ trống";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        dispatch(loginUserAndSave({ url: "auth/login", data }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  // useEffect to retrieve userDetail after loading completes and data is available
  useEffect(() => {
    if (!loading) {
      if (userDetail && userDetail.error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [userDetail.error.type]: userDetail.error.des,
        }));
      } else if (userDetail) {
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        navigate("/newsfeed");
      }
    }
  }, [loading, userDetail, navigate, toast]);

  return (
    <Stack
      w="40%"
      h="100%"
      overflow="auto"
      display={auth === "S" ? "none" : "block"}
    >
      <Flex h="100%" alignItems="center" justifyContent="center">
        <Flex flexDirection="column" p={12} w="450px">
          <Brand />
          <Heading textAlign="center" mb={6} mt={2}>
            Đăng nhập
          </Heading>
          <FormControl mb={3}>
            <FormLabel htmlFor="email" mb="0">
              Email
            </FormLabel>
            <Input
              id="email_"
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
              Mật khẩu
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
            <Flex w="100%" mb="5px" justifyContent="center">
              <Spinner color="blue.500" thickness="4px" size="lg" />
            </Flex>
          ) : (
            <Button
              bg={"#2d5be4"}
              _hover={{
                bg: "#1a409f ",
              }}
              color={'white'}
              mb={8}
              onClick={handleSubmit}
            >
              Đăng nhập
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
              Đăng ký ?
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default Login;
