/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Img, Stack } from "@chakra-ui/react";
import Spinner from "../components/common/spinner";
import Login from "../components/auth/login";
import SignUp from "../components/auth/signup";
import { useParams } from "react-router-dom";
const Auth = () => {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [auth, setAuth] = useState("L");
  const handleImageLoad = () => {
    setLoading(false);
  };
  const authSwitch = () => {
    if (auth === "L") setAuth("S");
    else setAuth("L");
  };
  useEffect(() => {
    // console.log(params.type)
    if (params.type) setAuth(params.type);
  }, []);
  return (
    <>
      {loading && <Spinner />}
      <Stack
        direction={["column", "row"]}
        w="100%"
        h="100vh"
        bg="gray.80"
        visibility={loading ? "hidden" : "visible"}
      >
        <Stack w="60%" h="100%" position="relative" bg={'#2d5be4'}>
          <Img
            src={"/src/assets/auth-pic.png"}
            h="100%"
            objectFit={'contain'}
            onLoad={handleImageLoad}
          />
        </Stack>
        <Login auth={auth} authSwitch={authSwitch} />
        <SignUp auth={auth} authSwitch={authSwitch} />
      </Stack>
    </>
  );
};

export default Auth;
