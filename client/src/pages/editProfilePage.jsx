import { Box, VStack, SimpleGrid, Spinner, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Header from "../components/common/header";
import PicSection from "../components/editProfile/picSection";
import InfoSection from "../components/editProfile/infoSection";
import AuthSection from "../components/editProfile/authSection";
import { useSelector } from "react-redux";

const EditProfilePage = () => {
  const toast = useToast();
  const userDetail = useSelector((state) => state.auth.userDetail);
  const [avatar, setAvatar] = useState(
    userDetail.avtPic ? userDetail.avtPic.display_url : ""
  );
  const [cover, setCover] = useState(
    userDetail.coverPic ? userDetail.coverPic.display_url : ""
  );
  const [name, setName] = useState(userDetail.userName);
  const [major, setMajor] = useState(userDetail.ChuyenNganh || "");
  const [year, setYear] = useState(userDetail.Khoa || "");
  const [email, setEmail] = useState(userDetail.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [storePic, setStorePic] = useState({
    avt: "",
    cover: "",
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStorePic((prev) => ({
        ...prev,
        avt: e.target.files,
      }));
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStorePic((prev) => ({
        ...prev,
        cover: e.target.files,
      }));
      setCover(URL.createObjectURL(file));
    }
  };

  // Hàm hiển thị toast
  const showToast = (title, description) => {
    toast({
      title,
      description,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <VStack h="100vh" justifyContent="center">
        <Spinner
          size="xl"
          emptyColor="gray.200"
          thickness="5px"
          speed="0.65s"
          color="blue.500"
        />
      </VStack>
    );
  }

  return (
    <VStack w={"100%"}>
      <Header />
      <Box bg="gray.50" minH="100vh" w={"100%"}>
        <Box maxW="container.lg" mx="auto" mt={3} mb={10}>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={10}
            px={{ base: 4, md: 0 }}
          >
            <PicSection
              cover={cover}
              avatar={avatar}
              handleAvatarChange={handleAvatarChange}
              handleCoverChange={handleCoverChange}
              showToast={showToast}
              setCover={setCover}
              setAvatar={setAvatar}
              storePic={storePic}
              userDetail={userDetail}
              initalAvatar={ userDetail.avtPic ? userDetail.avtPic.display_url : ""}
              initalCover={userDetail.coverPic ? userDetail.coverPic.display_url : ""}
            />
            <Box>
              <InfoSection
                year={year}
                setYear={setYear}
                major={major}
                setMajor={setMajor}
                name={name}
                setName={setName}
                showToast={showToast}
                userDetail={userDetail}
              />

              <AuthSection
                email={email}
                setEmail={setEmail}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                showToast={showToast}
                userDetail={userDetail}
              />
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </VStack>
  );
};

export default EditProfilePage;
