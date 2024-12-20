import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
  Checkbox,
  Text,
  Select,
} from "@chakra-ui/react";
import { DeleteIcon, LockIcon, ViewIcon, SearchIcon } from "@chakra-ui/icons";
import DateFormat from "../../utils/dateFormat";
import { useSelector } from "react-redux";
import {
  blogDetailClear,
  reloadDetailBlog,
} from "../../Redux/slices/blogSlice";
import { useSearchParams } from "react-router-dom";
import { AdminApi } from "../../apis/adminApi";

const ReportTable = ({
  allReport,
  handleViewReason,
  handleUser,
  handleDeleteGroup,
  handleDeletePost,
  currentPage,
  itemsPerPage,
  handleConfirmReport,
  dispatch,
  navigate,
  fetchReports,
  setPageIndex,
}) => {
  const userDetail = useSelector((state) => state.auth.userDetail);
  const [selectedRows, setSelectedRows] = useState({});
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedReportId, setSelectedReportId] = useState(null); // State to manage selected report actions visibility
  const actionMenuRef = useRef(null); // Ref for action menu

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedRows = {};
    (allReport.reports || []).forEach((report) => {
      newSelectedRows[report._id] = isChecked;
    });
    setSelectedRows(newSelectedRows);
  };

  const selectedUsers = Object.keys(selectedRows).filter(
    (key) => selectedRows[key]
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchTerm) {
        searchParams.set("page", 1);
        searchParams.set("searchQuery", searchTerm);
        setSearchParams(searchParams);
      } else {
        searchParams.delete("searchQuery");
        setSearchParams(searchParams);
      }
      fetchReports(searchTerm || "");
    }
  };

  // Close the action menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setSelectedReportId(null); // Close the menu when clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Hàm xử lý thay đổi trạng thái bộ lọc
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };
  const filteredReports = allReport.reports.filter((report) => {
    if (filterStatus == "all") return true; // Hiển thị tất cả nếu không có bộ lọc
    return filterStatus === "processed" ? report.state : !report.state; // Kiểm tra trạng thái "Đã xử lý" hoặc "Chưa xử lý"
  });
  return (
    <>
      <Flex justifyContent={"space-between"} mt={"2px"}>
        <Flex gap={"10px"}>
          <Button
            mb={4}
            colorScheme="blue"
            onClick={() => {
              setShowCheckboxColumn((prev) => !prev);
              if (showCheckboxColumn) {
                setSelectedRows({}); // Deselect all when hiding the checkbox column
              }
            }}
          >
            {showCheckboxColumn ? "Ẩn" : "Chọn"}
          </Button>
          {selectedUsers.length > 0 && (
            <Button
              mb={4}
              colorScheme="red"
              leftIcon={<DeleteIcon />}
              onClick={async () => {
                await AdminApi.deleteReport("report/delete/Report", {
                  reportIds: selectedUsers,
                });
                fetchReports(searchTerm || "");
                setSelectedRows({});
              }}
            >
              Xóa
            </Button>
          )}
        </Flex>

        <Flex gap={"10px"}>
          <Select
            // placeholder="Lọc theo trạng thái"
            value={filterStatus}
            onChange={handleFilterChange}
            w="200px"
          >
            <option value="all">Tất cả</option>
            <option value="unprocessed">Chưa xử lý</option>
            <option value="processed">Đã xử lý</option>
          </Select>

          <InputGroup mb={4} w={"300px"}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Tìm kiếm báo cáo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </InputGroup>
        </Flex>
      </Flex>

      <Table colorScheme="blue" size="sm">
        <Thead>
          <Tr>
            {showCheckboxColumn && (
              <Th>
                <Checkbox
                  border="1px solid #DFE0DC"
                  isChecked={
                    selectedUsers.length === (allReport.reports || []).length &&
                    selectedUsers.length > 0
                  }
                  isIndeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < (allReport.reports || []).length
                  }
                  onChange={handleSelectAll}
                />
              </Th>
            )}
            {/* <Th color="gray.700">Tiêu đề</Th> */}
            {/* <Th color="gray.700">Người dùng</Th> */}
            <Th color="gray.700">Người báo cáo</Th>
            <Th color="gray.700">Lý do</Th>
            <Th color="gray.700">Ngày báo cáo</Th>
            {/* <Th color="gray.700">Bài viết nhóm?</Th> */}
            <Th color="gray.700">Trạng thái</Th>
            <Th color="gray.700">Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredReports.map((report) => (
            <Tr key={report._id} _hover={{ bg: "blue.50", cursor: "pointer" }}>
              {showCheckboxColumn && (
                <Td>
                  <Checkbox
                    border="1px solid #DFE0DC"
                    isChecked={!!selectedRows[report._id]}
                    onChange={() => handleCheckboxChange(report._id)}
                  />
                </Td>
              )}
              {/* <Td fontWeight="semibold">{report.BaiViet_id.TieuDe}</Td> */}
              {/* <Td>{report.BaiViet_id.TaiKhoan_id.userName}</Td> */}
              <Td>{report.Reporter.userName || "Chưa xác định"}</Td>
              <Td
                maxW="200px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                <Text
                  fontWeight="500"
                  color="blue.500"
                  onClick={() => handleViewReason(report.NoiDung)}
                >
                  {report.NoiDung}
                </Text>
              </Td>
              <Td>{DateFormat(report.createdAt)}</Td>
              {/* <Td>{report.BaiViet_id.Group_id ? "Có" : "Không"}</Td> */}
              <Td fontWeight={"600"}>
                <Text color={!report.state ? "red.500" : "green.400"}>
                  {!report.state ? "Chưa xử lý" : "Đã xử lý"}
                </Text>
              </Td>
              <Td position="relative">
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    if (selectedReportId === report._id)
                      setSelectedReportId(null);
                    else setSelectedReportId(report._id);
                  }} // Open the custom menu for this report
                >
                  Hành động
                </Button>

                {/* Custom Action Menu */}
                {selectedReportId === report._id && (
                  <Box
                    ref={actionMenuRef} // Attach ref to the action menu
                    p={4}
                    borderWidth={1}
                    borderColor="blue.300"
                    bg="white"
                    shadow={"lg"}
                    borderRadius="md"
                    position="absolute"
                    top="0" // Place it below the button
                    right="100%"
                    zIndex="10"
                  >
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      leftIcon={<ViewIcon />}
                      width="full"
                      mb={2}
                      isDisabled={!report.BaiViet_id?.TaiKhoan_id}
                      onClick={() => {
                        dispatch(blogDetailClear());
                        dispatch(
                          reloadDetailBlog(
                            `posts/reload/${report.BaiViet_id._id}`
                          )
                        );
                        setTimeout(() => {
                          const filteredData = userDetail.BaiDang.filter(
                            (item) => item._id === report.BaiViet_id._id
                          );
                          const data = filteredData.length > 0;

                          data
                            ? navigate(
                                `/account/user/post/${report.BaiViet_id._id}`
                              )
                            : navigate(
                                `/account/guest/${report.BaiViet_id.TaiKhoan_id._id}/post/${report.BaiViet_id._id}`
                              );
                        }, 1000);
                      }}
                    >
                      Xem bài viết
                    </Button>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      leftIcon={<LockIcon />}
                      isDisabled={report.ownerPost.Blocked}
                      width="full"
                      mb={2}
                      onClick={() => {
                        handleUser(report.ownerPost._id, "block");
                        handleConfirmReport(report._id);
                        setSelectedReportId(null);
                      }}
                    >
                      Khóa tài khoản
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      leftIcon={<DeleteIcon />}
                      isDisabled={!report.BaiViet_id?.TaiKhoan_id}
                      width="full"
                      mb={2}
                      onClick={() => {
                        handleDeletePost(report.BaiViet_id, report._id);
                        setSelectedReportId(null);
                      }}
                    >
                      Xóa bài viết
                    </Button>
                    {/* <Button
                      colorScheme="red"
                      variant="outline"
                      leftIcon={<DeleteIcon />}
                      width="full"
                      mb={2}
                      // onClick={() => handleDeletePost(report._id)}
                    >
                      Xóa nhóm
                    </Button> */}
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      width="full"
                      isDisabled={report.state}
                      onClick={() => {
                        handleConfirmReport(report._id);
                        setSelectedReportId(null);
                      }}
                    >
                      Bỏ qua
                    </Button>
                  </Box>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default ReportTable;
