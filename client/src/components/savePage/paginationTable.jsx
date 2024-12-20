// Import các icon và các thành phần UI từ Chakra UI
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, IconButton } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getAllReports } from "../../Redux/slices/adminSlice";

// Component ButtonPagination: Tạo nút phân trang đơn lẻ
const ButtonPagination = (props) => {
  const { children, index, setPageIndex, colorScheme, pageIndex } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch()
  return (
    <Button
      size="lg"
      onClick={() => {
        // setPageIndex(index);
        searchParams.set("page", index + 1);
        setSearchParams(searchParams);
      }} // Chuyển đến trang khi nhấn nút
      color={pageIndex === index ? "white" : "black"}
      _hover={{
        backgroundColor: "myColor.100", // Màu nền khi hover
        color: "white", // Màu chữ khi hover
      }}
      bg={pageIndex === index ? colorScheme : "white"} // Đổi màu nền nếu là trang hiện tại
      width="48px"
  
      height="48px"
      variant="solid"
      textAlign="center"
    >
      {children}
    </Button>
  );
};

// Component PaginationTable: Tạo thanh điều hướng phân trang
const PaginationTable = (props) => {
  const { pageSize, pageIndex, setPageIndex, totalItemsCount, colorScheme } =
    props;

  // Hàm showButtons: Tạo các nút phân trang hiển thị
  const showButtons = () => {
    const buttons = [];
    const TOTAL_INDEX = Math.ceil(totalItemsCount / pageSize); // Tổng số trang
    const MAX_VISIBLE_BUTTONS = 4; // Số nút tối đa được hiển thị
    const startPage = Math.max(
      0,
      Math.min(
        pageIndex - Math.floor(MAX_VISIBLE_BUTTONS / 2),
        TOTAL_INDEX - MAX_VISIBLE_BUTTONS
      )
    ); // Trang bắt đầu
    const endPage = Math.min(TOTAL_INDEX, startPage + MAX_VISIBLE_BUTTONS); // Trang kết thúc

    // Hiển thị nút "1" nếu có các trang ẩn trước
    if (startPage > 1) {
      buttons.push(
        <ButtonPagination
          key={0}
          colorScheme={colorScheme}
          setPageIndex={setPageIndex}
          index={0}
          pageIndex={pageIndex}
        >
          1
        </ButtonPagination>
      );
      // Thêm dấu "..." nếu có nhiều trang ẩn
      if (startPage > 2) {
        buttons.push(
          <Button
            variant="ghost"
            _hover={{ backgroundColor: "transparent" }}
            key="start-dots"
            width="48px"
            height="48px"
            textAlign="center"
          >
            ...
          </Button>
        );
      }
    }

    // Thêm các nút phân trang từ startPage đến endPage
    for (let index = startPage; index < endPage; index++) {
      buttons.push(
        <ButtonPagination
          key={index}
          colorScheme={colorScheme}
          setPageIndex={setPageIndex}
          index={index}
          pageIndex={pageIndex}
        >
          {index + 1}
        </ButtonPagination>
      );
    }

    // Hiển thị dấu "..." nếu còn trang sau endPage
    if (endPage < TOTAL_INDEX - 1) {
      buttons.push(
        <Button
          variant="ghost"
          _hover={{ backgroundColor: "transparent" }}
          key="end-dots"
          width="48px"
          height="48px"
          textAlign="center"
        >
          ...
        </Button>
      );
    }

    // Thêm nút cuối cùng với số trang tổng
    if (endPage < TOTAL_INDEX) {
      buttons.push(
        <ButtonPagination
          key={TOTAL_INDEX - 1}
          colorScheme={colorScheme}
          setPageIndex={setPageIndex}
          index={TOTAL_INDEX - 1}
          pageIndex={pageIndex}
        >
          {TOTAL_INDEX}
        </ButtonPagination>
      );
    }

    return buttons; // Trả về danh sách nút phân trang
  };

  return (
    <HStack
      w="100%"
      p={2}
      fontFamily="'Poppins', sans-serif"
      justifyContent="center"
      display="flex"
    >
      <Box
        width="90%"
        justifyContent="center"
        display="flex"
        gap="10px"
        ml={"100px"}
      >
        {/* Nút mũi tên quay lại */}
        <IconButton
          icon={<ArrowLeftIcon />}
          size="sm"
          key="prev"
          onClick={() => setPageIndex(pageIndex - 1)} // Giảm chỉ số trang
          isDisabled={pageIndex <= 0} // Vô hiệu nếu ở trang đầu
          colorScheme={colorScheme}
          variant="link"
        />
        {/* Hiển thị các nút phân trang */}
        <HStack
          width="350px"
          display="flex"
          justifyContent="center"
          gap={"15px"}
        >
          {showButtons()}
        </HStack>
        {/* Nút mũi tên tiến tới */}
        <IconButton
          icon={<ArrowRightIcon />}
          size="sm"
          key="next"
          onClick={() => setPageIndex(pageIndex + 1)} // Tăng chỉ số trang
          isDisabled={pageIndex >= totalItemsCount / pageSize - 1} // Vô hiệu nếu ở trang cuối
          colorScheme={colorScheme}
          variant="link"
        />
      </Box>
      {/* Hiển thị số trang hiện tại và tổng số trang */}
      <Box w="15%" textAlign="center" visibility={"hidden"}>
        Page {pageIndex + 1} of {Math.ceil(totalItemsCount / pageSize)}
      </Box>
    </HStack>
  );
};

export default PaginationTable; // Xuất component PaginationTable
