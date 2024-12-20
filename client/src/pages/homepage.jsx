import { VStack } from "@chakra-ui/react";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Hero from "../components/homepage/hero";
import PopularPosts from "../components/homepage/popular/popularPosts";
import PopularGroups from "../components/homepage/popular/popularGroups";
import PopularTags from "../components/homepage/popular/polularTags";
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/common/spinner";
import { SocketContext } from "../provider/socketContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const socket = useContext(SocketContext);
  const boxChatList = useSelector((state) => state.chat.boxChat);
  const useDetail = useSelector((state) => state.auth.useDetail)
  const navigate =  useNavigate()
  const loadingHandle = () => {
    setLoading(false);
  };

  useEffect(() => {
    // boxChatList.forEach((boxChat) => {
    //   socket.emit("join_room", { room_id: boxChat._id });
    // });
  }, [socket, boxChatList]);
  // useEffect(() => {
  //   if (useDetail!==null) {
  //     navigate("/newsfeed", { replace: true });
  //   }
  // }, [useDetail, navigate]);
  return (
    <>
      {loading && <Spinner />}
      <VStack align="stretch" spacing={2} display={loading ? "none" : "block"}>
        <Header />
        <Hero loadingHandle={loadingHandle} />
        {/* <PopularPosts />
        <PopularGroups />
        <PopularTags /> */}
        <Footer />
      </VStack>
    </>
  );
};

export default HomePage;
