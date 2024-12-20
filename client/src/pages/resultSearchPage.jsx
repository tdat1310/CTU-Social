/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  Grid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import Header from "../components/common/header";
import { useNavigate, useParams } from "react-router-dom";
import UserResult from "../components/resultSearchPage/userResult";
import TagResult from "../components/resultSearchPage/tagResult";
import GroupResult from "../components/resultSearchPage/groupResult";
import PostResult from "../components/resultSearchPage/postResult";
import { useDispatch, useSelector } from "react-redux";
import { searchAllData } from "../Redux/slices/globalSlice";

const ResultSearchPage = () => {
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { querySearch } = useParams();
  const searchResult = useSelector((state) => state.global.searchResult);
  const userDetail = useSelector((state) => state.auth.userDetail);
  useEffect(() => {
    setIsLoading(true); // Bắt đầu loading
    dispatch(searchAllData(`infos/search/result?keyword=${querySearch}`));
    const timer = setTimeout(() => {
      setIsLoading(false); // Kết thúc loading sau 1 giây
    }, 1000);

    return () => clearTimeout(timer); // Clear timer khi component unmount
  }, [querySearch]);

  return (
    <>
      <Header />
      <Box p={8} maxW="7xl" mx="auto" minH="100vh">
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"
          >
            <Spinner size="xl" color="blue.500" />
          </Box>
        ) : (
          <>
            <Box w={"100%"} fontSize={"40px"} fontWeight={"400"} mb={"10px"}>
              <Text>{`Kết quả tìm kiếm cho "${querySearch}"`}</Text>
            </Box>

            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList mb={4}>
                <Tab>Người dùng</Tab>
                <Tab>Tag</Tab>
                <Tab>Bài viết</Tab>
                <Tab>Nhóm</Tab>
              </TabList>

              <TabPanels>
                {/* Tab panel for Users */}
                <TabPanel>
                  <Heading size="md" mb={4}>
                    Kết quả Người dùng
                  </Heading>
                  {searchResult.users.length > 0 ? (
                    <Grid
                      templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                      gap={6}
                    >
                      {searchResult.users.map((user, index) => (
                        <UserResult
                          key={index}
                          user={user}
                          userId={userDetail._id}
                          navigate={navigate}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <Text>Không tìm thấy người dùng nào.</Text>
                  )}
                </TabPanel>

                {/* Tab panel for Tags */}
                <TabPanel>
                  <Heading size="md" mb={4}>
                    Kết quả Tag
                  </Heading>
                  {searchResult.tags.length > 0 ? (
                    <Stack direction="row" spacing={4} wrap="wrap">
                      {searchResult.tags.map((tag, index) => (
                        <TagResult key={index} tag={tag} navigate={navigate} />
                      ))}
                    </Stack>
                  ) : (
                    <Text>Không tìm thấy tag nào.</Text>
                  )}
                </TabPanel>

                {/* Tab panel for Posts */}
                <TabPanel>
                  <Heading size="md" mb={4}>
                    Kết quả Bài viết
                  </Heading>
                  {searchResult.posts.length > 0 ? (
                    <Grid
                      templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                      gap={6}
                    >
                      {searchResult.posts.map((post, index) => (
                        <PostResult
                          key={index}
                          post={post}
                          navigate={navigate}
                          userDetail={userDetail}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <Text>Không tìm thấy bài viết nào.</Text>
                  )}
                </TabPanel>

                {/* Tab panel for Groups */}
                <TabPanel>
                  <Heading size="md" mb={4}>
                    Kết quả Nhóm
                  </Heading>
                  {searchResult.groups.length > 0 ? (
                    <Grid
                      templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                      gap={6}
                    >
                      {searchResult.groups.map((group, index) => (
                        <GroupResult key={index} group={group} navigate={navigate}/>
                      ))}
                    </Grid>
                  ) : (
                    <Text>Không tìm thấy nhóm nào.</Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </Box>
    </>
  );
};

export default ResultSearchPage;
