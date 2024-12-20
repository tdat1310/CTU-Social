/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Spinner,
  Center,
  useToast,
  HStack,
} from "@chakra-ui/react";
import Header from "../components/common/header";
import PaginationTable from "../components/savePage/paginationTable";
import {
  clearAllData,
  getAllAccounts,
  getAllReports,
} from "../Redux/slices/adminSlice";
import ReportTable from "../components/aminPage/reportTable";
import { AdminApi } from "../apis/adminApi";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { ViewIcon, SettingsIcon } from "@chakra-ui/icons";
import UserTable from "../components/aminPage/userTable";
import { TbReport } from "react-icons/tb";
import { BiSolidUserAccount } from "react-icons/bi";
import BlogApi from "../apis/blogApi";
import { reloadData } from "../Redux/slices/authSlice";
import { FcStatistics } from "react-icons/fc";
import { FaChartBar } from "react-icons/fa";
import ChartCustom from "../components/aminPage/chartCustom";
const AdminPage = () => {
  const userDetail = useSelector((state) => state.auth.userDetail);
  const allReport = useSelector((state) => state.admin.reports) || [];
  const allAccount = useSelector((state) => state.admin.accounts) || [];
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [view, setView] = useState(searchParams.get("type"));
  const view = searchParams.get("type");
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fullReason, setFullReason] = useState("");
  const [pageIndex, setPageIndex] = useState(+searchParams.get("page") - 1);
  const [pageSize, setPageSize] = useState(10);

  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (userDetail && userDetail.admin === false) {
      navigate("/*");
    }
  }, [userDetail, navigate]);
  useEffect(() => {
    // searchParams.set("page", pageIndex + 1);
    //  searchParams.set("type", view);
    // setSearchParams(searchParams);
  }, [searchParams, setSearchParams, view, pageIndex]);
  const fetchReports = (search, isSearch) => {
    dispatch(
      getAllReports(
        `report/getAllReport?page=${+searchParams.get(
          "page"
        )}&limit=${pageSize}&searchQuery=${search}`
      )
    );
  };
  const fetchAccounts = (search) => {
    dispatch(
      getAllAccounts(
        `report/getAllAccount?page=${+searchParams.get(
          "page"
        )}&limit=${pageSize}&searchQuery=${search}`
      )
    );
  };
  useEffect(() => {
    setLoading(true);
    // dispatch(clearAllData());\
    if (view === "reports") fetchReports(searchParams.get("searchQuery") || "");
    if (view === "accounts")
      fetchAccounts(searchParams.get("searchQuery") || "");

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [pageIndex, view, dispatch, searchParams]);

  const handleDeletePost = async (post, reportId) => {
  
    await BlogApi.deleteBlog(`posts/${post._id}`);
    dispatch(reloadData(`accounts/reload/${userDetail._id}`));
    handleConfirmReport(reportId)
    toast({
      title: "Xác nhận đã xóa bài viết",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUser = async (userId, action) => {
    await AdminApi.lockAccount("report/blockAccount", {
      accountId: userId,
      action: action,
    });
    if (view === "reports") fetchReports("");
    if (view === "accounts") fetchAccounts("");
    toast({
      title: "Xử lý tài khoản thành công.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleViewReason = (reason) => {
    setFullReason(reason);
    onOpen();
  };

  const handleConfirmReport = async (reportId) => {
    await AdminApi.statusReportConfirm("report/confirmReport", { reportId });
    setTimeout(() => {
      dispatch(
        getAllReports(
          `report/getAllReport?page=${pageIndex + 1}&limit=${pageSize}`
        )
      );
      if (view === "reports") fetchReports("");
      if (view === "accounts") fetchAccounts("");

      toast({
        title: "Xác nhận đã xử lý báo cáo",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1000);
  };
  const renderContent = () => {
    if (loading) {
      return (
        <Center height="200px" h={"100vh"}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      );
    }

    switch (view) {
      case "reports":
        if (allReport?.reports?.length === 0) {
          return (
            <Alert status="info" borderRadius="md" >
              < AlertIcon />
              Không có bài viết nào bị báo cáo.
            </Alert>
          );
        }
        return (
          <>
            <Box
              overflowX="auto"
              borderRadius="lg"
              paddingInline={"20px"}
              bg="white"
              w={"100%"}
              height={"550px"}
            >
              <ReportTable
                allReport={allReport}
                handleViewReason={handleViewReason}
                handleUser={handleUser}
                handleDeletePost={handleDeletePost}
                handleConfirmReport={handleConfirmReport}
                currentPage={pageIndex}
                itemsPerPage={pageSize}
                dispatch={dispatch}
                navigate={navigate}
                loading={loading}
                fetchReports={fetchReports}
                setPageIndex={setPageIndex}
              />
            </Box>
            <PaginationTable
              pageSize={pageSize}
              pageIndex={+searchParams.get("page") - 1}
              setPageIndex={setPageIndex}
              colorScheme="myColor.200"
              totalItemsCount={allReport?.totalPages * 10}
            />
          </>
        );
      case "accounts":
        if (allAccount?.accounts?.length === 0) {
          return (
            <Alert status="info" bg="blue.100" borderRadius="md">
              <AlertIcon />
              Không có tài khoản nào.
            </Alert>
          );
        }
        return (
          <>
            <Box
              overflowX="auto"
              borderRadius="lg"
              paddingInline={"20px"}
              bg="white"
              height={"550px"}
              w={"100%"}
            >
              <UserTable
                allAccount={allAccount}
                loading={loading}
                handleUser={handleUser}
                fetchAccounts={fetchAccounts}
              />
            </Box>
            <PaginationTable
              pageSize={pageSize}
              pageIndex={+searchParams.get("page") - 1}
              setPageIndex={setPageIndex}
              colorScheme="myColor.200"
              totalItemsCount={allAccount?.totalPages * 10}
            />
          </>
        );
      case "statistics":
        // Thêm nội dung cho view "settings" ở đây
        return (
          <ChartCustom/>
        );

      default:
        return <Alert status="warning">Không tìm thấy nội dung.</Alert>;
    }
  };
  return (
    <VStack display="flex" w="100%" h="100vh">
      <Header />
      <HStack flex="1" p={5} spacing={6} align="stretch" w={"100%"}>
        <Box
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="start"
          borderRadius="md"
          w="15%"
          mt={"47px"}
        >
          <Button
            variant="ghost"
            onClick={() => {
              if (view != "reports") {
                // setView("reports");
                // setPageIndex(0);
                setLoading(true);
                // searchParams.delete("searchQuery");
                // setSearchParams(searchParams);
                navigate(`/admin?page=1&type=reports`);
              }
            }}
            colorScheme="blue"
            mb={4}
            isActive={view === "reports"}
            color="#2d5be4"
            _hover={{ bg: "#4f7fd1", color: "white" }}  // Nhạt hơn #2d5be4 một chút
            _active={{ bg: "#2d5be4", color: "white" }} // Đậm hơn #2d5be4 một chút
            fontWeight={view === "reports" ? "bold" : "normal"}
            w="100%"
            justifyContent="start"
            leftIcon={<TbReport />}
          >
            Báo cáo
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (view != "accounts") {
                // setView("accounts");
                // setPageIndex(0);
                setLoading(true);
                // searchParams.delete("searchQuery");
                // setSearchParams(searchParams);
                navigate(`/admin?page=1&type=accounts`);
              }
            }}
            colorScheme="blue"
            isActive={view === "accounts"}
            color="#2d5be4"
            _hover={{ bg: "#4f7fd1", color: "white" }}  // Nhạt hơn #2d5be4 một chút
            _active={{ bg: "#2d5be4", color: "white" }} // Đậm hơn #2d5be4 một chút
            fontWeight={view === "accounts" ? "bold" : "normal"}
            w="100%"
            justifyContent="start"
            leftIcon={<BiSolidUserAccount />}
            mb={4}
          >
            Tài khoản
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (view != "statistics") {
                // setView("accounts");
                // setPageIndex(0);
                setLoading(true);
                // searchParams.delete("searchQuery");
                // setSearchParams(searchParams);
                navigate(`/admin?page=1&type=statistics`);
              }
            }}
            colorScheme="blue"
            isActive={view === "statistics"}
            color="#2d5be4"
            _hover={{ bg: "#4f7fd1", color: "white" }}  // Nhạt hơn #2d5be4 một chút
            _active={{ bg: "#2d5be4", color: "white" }} // Đậm hơn #2d5be4 một chút
            fontWeight={view === "statistics" ? "bold" : "normal"}
            w="100%"
            justifyContent="start"
            leftIcon={<FaChartBar />}
          >
            Thống kê
          </Button>
        </Box>
        <VStack
          w={"85%"}
          overflowY="auto" // Thêm thanh cuộn dọc
          maxHeight="550px" // Đặt chiều cao tối đa để kích hoạt thanh cuộn
          height={"550px"}
        >
          <Heading
            as="h2"
            size="lg"
            color="#2d5be4"
            textAlign="center"
            textTransform="uppercase"
            mb={4}
          >
            Quản trị viên
          </Heading>

          {renderContent()}
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Lý do báo cáo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{fullReason}</Text>
            </ModalBody>
            <Box p={4} display="flex" justifyContent="flex-end">
              <Button colorScheme="gray" onClick={onClose}>
                Đóng
              </Button>
            </Box>
          </ModalContent>
        </Modal>
      </HStack>
    </VStack>
  );
};

const MemoizedAdminPage = React.memo(AdminPage);
MemoizedAdminPage.displayName = "AdminPage";

export default MemoizedAdminPage;
