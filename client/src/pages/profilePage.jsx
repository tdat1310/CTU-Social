/* eslint-disable react-hooks/exhaustive-deps */
import { Progress, VStack, Spinner, Center } from "@chakra-ui/react";
import Header from "../components/common/header";
import ProfileHeader from "../components/profile/profileHeader";
import ProfileContent from "../components/profile/profileContent";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { UserApi } from "../apis/userApi";
import { reloadData } from "../Redux/slices/authSlice";

const ProfilePage = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // State để quản lý loading
  const userAcc = useSelector((state) => state.auth.userDetail);
  const { role, user_id } = useParams();
  const scrollContainerRef = useRef(null);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  useEffect(()=>{
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  },[role, user_id])
  useEffect(() => {
    const getInfo = async () => {
      try {
        const fetchedData = await UserApi.getUserInfo(`accounts/${user_id}`);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        // Hiển thị spinner ít nhất 1 giây
         setTimeout(() => setIsLoading(false), 500);
      }
    };

    if (role === "user") {
      setData(userAcc);
    } else if (role === "guest" && user_id === userAcc._id) {
      navigate(`/account/user`);
    } else {
      getInfo();
    }
  }, [role, user_id, reload]);

  if (isLoading) {
    return (
      <Center h="100vh" w="100vw">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <>
      {!isLoading && (
        <>
          {progress > 0 && progress < 100 && (
            <Progress
              value={60}
              size="sm"
              position="sticky"
              top={0}
              zIndex={100}
              isIndeterminate
            />
          )}

          <VStack ref={scrollContainerRef} overflowY="auto" h="100vh" gap={"0"}>
            <Header />
            <VStack w={"100%"} bg={"#eff4fa"}>
              <ProfileHeader data={data} setReload={setReload} />
              <ProfileContent
                setProgress={setProgress}
                data={data}
                setReload={setReload}
                scrollContainerRef={scrollContainerRef}
              />
            </VStack>
          </VStack>
        </>
      )}
    </>
  );
};

export default ProfilePage;
