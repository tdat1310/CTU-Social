/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Flex,
  Link,
  IconButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
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
import ModalCustom from "../Modal/modalCustom";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/slices/authSlice";
import { useEffect, useState } from "react";
import { notifySetStatus } from "../../Redux/slices/notifySlice";
import NotifyPanel from "./notifyPanel";
import MessagePanel from "./messagePanel";
import { persistor } from "../../Redux/store";
import { TiPlus } from "react-icons/ti";
const links = [
  { text: "Trang chủ", href: "/" },
  { text: "Bảng tin", href: "/newsfeed" },
];

const iconButtons = [{ icon: <TiPlus />, ariaLabel: "Tạo post" }];

const HomeNavbar = ({ userDetail }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifyState, setNotifyState] = useState(false);
  let notifyList = useSelector((state) => state.notify.notifyList) || [];

  const handleEvent = (ariaLabel) => {
    if (ariaLabel === "Tạo post") onOpen();
  };

  useEffect(() => {
    // if (notifyState && notifyList.length > 0) {
    //   dispatch(notifySetStatus(`notify/seen/${userDetail._id}`));
    // }
  }, [dispatch, notifyState, notifyList, userDetail._id]);

  // Hàm tạo các mục menu
  const renderMenuItems = () => (
    <>
      <MenuItem onClick={() => navigate("/account/user")} fontWeight={'500'}>
        <FaUser style={{ marginRight: "20px", color: "#2d5be4" }} /> Trang cá
        nhân
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={()=>{
        navigate('/account/save')
      }} fontWeight={'500'}>
        <FaBookmark style={{ marginRight: "20px", color: "#2d5be4" }} /> Đã lưu
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={() => navigate("/group")} fontWeight={'500'}>
        <FaUsers style={{ marginRight: "20px", color: "#2d5be4" }} /> Nhóm người
        dùng
      </MenuItem>
      {userDetail.admin && (
        <>
          <MenuDivider />
          <MenuItem onClick={() => navigate("/admin?page=1&type=reports")} fontWeight={'500'}>
            <FaUserShield style={{ marginRight: "20px", color: "#2d5be4" }} />{" "}
            Quản trị viên
          </MenuItem>
        </>
      )}
      <MenuDivider />
      <MenuItem
        onClick={() => {
          navigate("/");
          dispatch(logout());
          // persistor.purge();
        }}
        fontWeight={'500'}
        
      >
        <FaSignOutAlt style={{ marginRight: "20px", color: "#2d5be4" }} /> Đăng
        xuất
      </MenuItem>
    </>
  );

  return (
    <Box px={4}>
      <Flex h={16} alignItems={"center"} justifyContent="flex-end">
        <IconButton
          size={"md"}
          icon={isOpen ? <FaTimes /> : <FaHamburger />}
          aria-label={"Open navigation"}
          display={["inherit", "inherit", "none"]}
          onClick={onToggle}
          mr={2}
        />
        {links.map((link, index) => (
          <Link
            as={RouterLink}
            key={index}
            px={2}
            py={1}
            rounded={"md"}
            fontWeight={600}
            _hover={{ textDecoration: "none" }}
            to={link.href}
            mr={4}
          >
            {link.text}
          </Link>
        ))}
        <Flex alignItems={"center"} gap="15px">
          <HStack spacing={"15px"}>
            {iconButtons.map((button, index) => (
              <Box key={index} position={"relative"}>
                <IconButton
                  icon={button.icon}
                  aria-label={button.ariaLabel}
                  rounded="full"
                  color={"#d2eef5"}
                  fontSize={'29px'}
                  _hover={{
                    bg: 'none',
                    transform: 'scale(1.1)'
                  }}
               
                  transition={'0.4s'}
                  variant={'ghost'}
                  onClick={() => handleEvent(button.ariaLabel)}
                />
              </Box>
            ))}
          </HStack>
          <MessagePanel />
          <NotifyPanel
            setNotifyState={setNotifyState}
            dispatch={dispatch}
            user_id={userDetail._id}
          />
          <Menu>
            <MenuButton
              as={Link}
              rounded={"full"}
              cursor={"pointer"}
              minW={0}
              mr={2}
              _hover={{ textDecoration: "none" }}
            >
              <HStack gap={"15px"}>
                <Tooltip label={userDetail.userName}>
                  <Text fontWeight={600} mt={"5px"} noOfLines={1} maxW={"75px"}>
                    {userDetail.userName}
                  </Text>
                </Tooltip>
                <Avatar
                  w={'45px'}
                  h={'45px'}
                  border={'3px #ffffff solid'}
                  src={userDetail.avtPic ? userDetail.avtPic.display_url : ""}
                />
              </HStack>
            </MenuButton>
            <MenuList border="1px solid #DFE0DC" shadow={"md"} color={'black'} fontWeight={'600'} position={'relative'} >
            <Box
                position="absolute"
                top="-8px"
                right="11px"
                width="0"
                height="0"
                borderLeft="9px solid transparent"
                borderRight="9px solid transparent"
                borderBottom="9px solid #DFE0DC"
              >
                <Box
                  position="absolute"
                  top="0px"
                  right="-9px"
                  width="0"
                  height="0"
                  borderLeft="9px solid transparent"
                  borderRight="9px solid transparent"
                  borderBottom="9px solid white"
                />
              </Box>
              {renderMenuItems()}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={["inherit", "inherit", "none"]}>
          {links.map((link, index) => (
            <Link
              as={RouterLink}
              key={index}
              px={2}
              py={1}
              rounded={"md"}
              _hover={{ textDecoration: "none" }}
              to={link.href}
              mr={4}
            >
              {link.text}
            </Link>
          ))}
        </Box>
      )}

      <ModalCustom
        isModalOpen={isModalOpen}
        onClose={onClose}
        editMode={false}
        detail={false}
        feed={true}
      />
    </Box>
  );
};

export default HomeNavbar;
