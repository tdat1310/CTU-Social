import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Box, Center, Text } from "@chakra-ui/react";
import "./App.css";
import HomePage from "./pages/homepage";
import Auth from "./pages/auth";
import ErrorPage from "./pages/errorPage";
import ProfilePage from "./pages/profilePage";
import DetailBlogPage from "./pages/detailBlogPage";
import ChatPage from "./pages/chatPage";
import NewsFeedPage from "./pages/newsFeedPage";
import TagPage from "./pages/tagPage";
import GroupPage from "./pages/groupPage";
import GroupDetail from "./pages/groupDetail";
import EditProfilePage from "./pages/editProfilePage";
import ResultSearchPage from "./pages/resultSearchPage";
import SavePage from "./pages/savePage";
import AdminPage from "./pages/adminPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import { useSelector } from "react-redux";
import ProtectRoute from "./protectRoute";

const routes = [
  { path: "/", element: <HomePage />, index: true },
  { path: "/auth/:type", element: <Auth /> },
  { path: "/*", element: <ErrorPage /> },
  { path: "/account/:role/:user_id?", element: <ProfilePage /> },
  {
    path: "/account/:role/:user_id/post/:post_id/:index?",
    element: <DetailBlogPage />,
  },
  { path: "/account/:role/post/:post_id/:index?", element: <DetailBlogPage /> },
  {
    path: "/group/:group_id/:user_id/post/:post_id",
    element: <DetailBlogPage />,
  },
  { path: "/chat", element: <ChatPage /> },
  { path: "/newsfeed", element: <NewsFeedPage /> },
  { path: "/tags/:tag_name/:tag_id", element: <TagPage /> },
  { path: "/group", element: <GroupPage /> },
  { path: "/group/:group_id", element: <GroupDetail /> },
  { path: "/editProfile", element: <EditProfilePage /> },
  { path: "/search/result/:querySearch", element: <ResultSearchPage /> },
  { path: "/account/save", element: <SavePage /> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/test", element: <SearchResultsPage /> },
];

function App() {
  const userDetail = useSelector((state) => state.auth.userDetail);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (!userDetail && !location.pathname.startsWith("/auth/")) {
  //     navigate("/");  // Redirect to home page if userDetail is null and not on auth page
  //   }
  // }, [userDetail, navigate, location.pathname]);

  return (
    <div tabIndex="-1">
      {/* Lớp phủ khi tài khoản bị khóa */}
      {userDetail && userDetail.Blocked && (
        <Box
          position="fixed"
          top={0}
          left={0}
          overflow={"hidden"}
          width="100%"
          height="100%"
          backgroundColor="rgba(0, 0, 0, 0.7)"
          zIndex={9999}
        >
          <Center height="100%">
            <Box
              padding={6}
              backgroundColor="white"
              borderRadius="8px"
              boxShadow="lg"
              maxWidth="500px"
              textAlign="center"
            >
              <Text fontSize="xl" fontWeight="bold" color="red.500">
                Tài khoản của bạn đã bị khóa!
              </Text>
            </Box>
          </Center>
        </Box>
      )}

      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              !route.path.startsWith("/auth") && route.path !== "/" ? (
                <ProtectRoute>{route.element}</ProtectRoute>
              ) : (
                route.element
              )
            }
            index={route.index}
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
