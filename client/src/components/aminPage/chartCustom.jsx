/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Button,
  Box,
  Text,
  VStack,
  Divider,
  HStack,
  Flex,
  Select,
  Input,
  Image,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import styles
import ListPost from "./listPost";
import { color } from "framer-motion";
import { fetchGlobalData } from "../../Redux/slices/globalSlice";

// Đăng ký các thành phần với Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ChartCustom = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState(''); // Default to today
  const posts = useSelector((state) => state.global.postChart);
  const [today, setToday] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGlobalData(`infos/globalData?post=${3}`));
  }, []);
  const getMondayOfWeek = (weekOffset) => {
    const startDate = new Date();
    const dayOfWeek = startDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(startDate);
    monday.setDate(startDate.getDate() + diff + weekOffset * 7);
    return monday;
  };

  const getWeekDays = (monday) => {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const getWeeklyPostCounts = (posts, weekDays) => {
    const weeklyCounts = new Array(7).fill(0);
    posts.forEach((post) => {
      const postDate = new Date(post.createdAt);
      for (let i = 0; i < 7; i++) {
        if (weekDays[i].toDateString() === postDate.toDateString()) {
          weeklyCounts[i]++;
        }
      }
    });
    return weeklyCounts;
  };

  const getMonthlyPostCounts = (posts) => {
    const monthlyCounts = new Array(12).fill(0);
    posts.forEach((post) => {
      const postDate = new Date(post.createdAt);
      if (postDate.getFullYear() === currentYear) {
        monthlyCounts[postDate.getMonth()]++;
      }
    });
    return monthlyCounts;
  };

  const currentMonday = getMondayOfWeek(currentWeek);
  const weekDays = getWeekDays(currentMonday);
  const weeklyPostCounts = getWeeklyPostCounts(posts, weekDays);
  const monthlyPostCounts = getMonthlyPostCounts(posts);

  const formatDate = (date, viewMode) => {
    if (viewMode === "month") {
      // Hiển thị theo tháng
      return new Intl.DateTimeFormat("vi-VN", {
        month: "long",
        year: "numeric",
      }).format(date);
    } else if (viewMode === "week") {
      // Hiển thị theo ngày
      return new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    }
    return ""; // Trường hợp không xác định `viewMode`
  };
  // Hàm để lấy bài viết của ngày đã chọn
  const getPostsByDate = (selectedDate) => {
    if (selectedDate == "") return [];
    return posts.filter((post) => {
      const postDate = new Date(post.createdAt);

      // Kiểm tra nếu chế độ là "week", so sánh theo ngày
      if (viewMode === "week") {
        return postDate.toDateString() === selectedDate.toDateString();
      }
      // Nếu chế độ là "month", so sánh theo tháng và năm
      if (viewMode === "month") {
        return (
          postDate.getMonth() === selectedDate.getMonth() &&
          postDate.getFullYear() === selectedDate.getFullYear()
        );
      }

      return false;
    });
  };

  const chartData = {
    labels:
      viewMode === "week"
        ? weekDays.map((day) => `${day.getDate()}/${day.getMonth() + 1}`)
        : Array.from({ length: 12 }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: viewMode === "week" ? "Số bài viết tuần" : "Số bài viết tháng",
        data: viewMode === "week" ? weeklyPostCounts : monthlyPostCounts,
        borderColor: "#2d5be4",
        backgroundColor: "#c4ccfc",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
       // console.log(clickedIndex);
        setSelectedDate(
          viewMode === "week"
            ? weekDays[clickedIndex]
            : new Date(new Date().setMonth(clickedIndex))
        );
      }
    },
  };

  const changeTime = (direction) => {
    if (viewMode === "week") {
      setCurrentWeek((prevWeek) => prevWeek + direction);
    }
    if (viewMode === "month") {
      setCurrentYear((prevYear) => prevYear + direction);
    }
  };
  // console.log(getPostsByDate(selectedDate))
  return (
    <Box borderWidth={1} borderRadius="md" bg="white" w={"100%"}>
      <VStack spacing={2} align="stretch">
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize="xl" fontWeight="bold">
            {viewMode === "week" ? "Tuần bắt đầu từ: " : "Tháng hiện tại: "}
            {viewMode === "week" ? (
              <Text as="span" color="#2d5be4">
                {formatDate(currentMonday, 'week')}{" "}
              </Text>
            ) : (
              <Text as="span" color="#2d5be4">
                {`${currentMonth + 1}/${currentYear}`}{" "}
              </Text>
            )}
          </Text>
          <Select
            value={viewMode}
            onChange={(e) => {
              setViewMode(e.target.value);
              viewMode == "week"
                ? setCurrentWeek(0)
                : setCurrentYear(new Date().getFullYear());
              setSelectedDate("");
            }}
            mb={4}
            w={"200px"}
          >
            <option value="week">Xem theo tuần</option>
            <option value="month">Xem theo tháng</option>
          </Select>
        </Flex>
        <Divider />
        <Flex mt={2} w={"100%"}>
          <Flex flexDirection={"column"} w={"100%"}>
            <Box w={"100%"} display={"flex"}>
              {/* <Text fontSize="lg" textAlign="center" color="blue.600" w={'50%'}>
                Ngày hôm nay: {formatDate(today)}{" "}
              </Text> */}
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  // Lấy ngày hiện tại
                  const currentDate = new Date();

                  // Tính số ngày chênh lệch giữa ngày hiện tại và ngày được chọn
                  const differenceInDays = Math.floor(
                    (date - currentDate) / (1000 * 60 * 60 * 24)
                  );

                  // Làm tròn cận dưới để tính số tuần chênh lệch
                  let differenceInWeeks = Math.floor(differenceInDays / 7);

                  // Nếu ngày được chọn là thứ Hai, Ba hoặc Tư thì +1 tuần
                  const dayOfWeek = date.getDay();
                  if (dayOfWeek >= 1 && dayOfWeek <= 3) {
                    differenceInWeeks += 1;
                  }

                  // Cập nhật trạng thái
                  setCurrentWeek(differenceInWeeks);
                }}
                dateFormat="dd/MM/yyyy"
                customInput={
                  <Flex
                    w={"100%"}
                    h={"30px"}
                    display={viewMode != "week" && "none"}
                  >
                    <Button>Chọn ngày</Button>
                  </Flex>
                }
                className="date-picker"
              />
            </Box>
            <Box width="100%">
              <Line data={chartData} options={chartOptions} />
            </Box>
            <HStack spacing={4} justify="center" mt={4}>
              <Button
                onClick={() => {
                  changeTime(-1);
                 // setSelectedDate(new Date()); // Reset selected date when changing time
                }}
              >
                {viewMode === "week" ? "Tuần Trước" : "Năm Trước"}
              </Button>
              <Button
                onClick={() => {
                  changeTime(1);
              //   setSelectedDate(new Date()); // Reset selected date when changing time
                }}
              >
                {viewMode === "week" ? "Tuần Sau" : "Năm Sau"}
              </Button>
            </HStack>
          </Flex>
          <Box width="100%">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {viewMode === "week"
                ? "Bài viết trong ngày: "
                : "Bài viết trong tháng: "}
              {selectedDate ? formatDate(selectedDate, viewMode) : ""}
            </Text>
            {selectedDate && getPostsByDate(selectedDate).length > 0 ? (
              <ListPost
                getPostsByDate={getPostsByDate}
                selectedDate={selectedDate}
              />
            ) : (
              <Flex w={"100%"} justifyContent={"center"}>
                <Image h={"350px"} src="/src/assets/no-data-chart.png" />
              </Flex>
            )}
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ChartCustom;
