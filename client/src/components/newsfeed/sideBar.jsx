import React, { useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  IconButton,
  VStack,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { FaHome, FaBell, FaCog } from "react-icons/fa";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  FaHamburger,
  FaTimes,
  FaPlus,
  FaUser,
  FaBookmark,
  FaUsers,
  FaSignOutAlt,
  FaUserShield, // Import biểu tượng Quản trị viên
} from "react-icons/fa"; // Import thêm các icon
import { useNavigate } from "react-router-dom";
const Sidebar = ({ userDetail }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  const naviagate = useNavigate();
  const menuItems = [
    {
      icon: (
        <Box mr={"10px"}>
          <FaUser />
        </Box>
      ),
      text: "Trang cá nhân",
      link: "/account/user",
    },
    userDetail.admin
      ? {
          icon: (
            <Box mr={"10px"}>
              <FaUserShield />
            </Box>
          ),
          text: "Quản trị viên",
          link: "/admin?page=1&type=reports",
        }
      : null,
    {
      icon: (
        <Box mr={"10px"}>
          <FaBookmark />
        </Box>
      ),
      text: "Đã lưu",
      link: "/account/save",
    },
    {
      icon: (
        <Box mr={"10px"}>
          <FaUsers />
        </Box>
      ),
      text: "Nhóm",
      link: "/group",
    },
  ].filter((item) => item !== null);

  return (
    <Flex
      direction="column"
      bg="#2d5be4"
      color="#d0ecff"
      fontWeight={"500"}
      h="100vh"
      w={isCollapsed ? "80px" : "250px"}
      transition="width 0.3s"
      shadow="md"
    >
      {/* Avatar Section */}
      <Flex
        align="center"
        justifyContent={isCollapsed ? "flex-start" : "flex-start"}
        p={4}
        borderBottom="1px solid #2a86d5"
      >
        <Avatar size="md" src={userDetail?.avtPic?.display_url || ""} />
        <Text
          ml={4}
          opacity={isCollapsed ? 0 : 1}
          transform={isCollapsed ? "translateX(-20px)" : "translateX(0)"}
          transition="all 0.3s"
          whiteSpace="nowrap"
        >
          {userDetail.userName}
        </Text>
      </Flex>

      <VStack align="start" spacing={4} p={4} flex="1">
        {menuItems.map((item, index) => (
          <Tooltip
            label={item.text}
            placement="right"
            isDisabled={!isCollapsed}
            key={index}
          >
            <Flex
              align="center"
              w="100%"
              p={2}
              borderRadius="md"
              _hover={{ bg: "#234ca1", cursor: "pointer" }}
              onClick={() => {
                naviagate(item.link);
              }}
            >
              {/* Icon luôn giữ nguyên */}

              <IconButton
                w={"50px"}
                icon={item.icon}
                boxSize={6}
                fontSize={"20px"}
                rounded="full"
                color={"white"}
                _hover={{
                  bg: "none",
                }}
                variant={"ghost"}
                transition="transform 0.3s"
                transform={isCollapsed ? "translateX(0)" : "translateX(0)"}
              />
              {/* Văn bản có hiệu ứng biến mất */}
              <Text
                ml={4}
                opacity={isCollapsed ? 0 : 1}
                transform={isCollapsed ? "translateX(-20px)" : "translateX(0)"}
                transition="all 0.3s"
                whiteSpace="nowrap"
              >
                {item.text}
              </Text>
            </Flex>
          </Tooltip>
        ))}
      </VStack>

      {/* Collapse Button */}
      <IconButton
        aria-label="Toggle Sidebar"
        icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        onClick={handleToggle}
        alignSelf={isCollapsed ? "center" : "flex-end"}
        m={4}
        bg="#5095e2"
        color={"white"}
        position={"absolute"}
        bottom={"0"}
        _hover={{ bg: "#3c7ab1" }}
      />
    </Flex>
  );
};

export default Sidebar;
