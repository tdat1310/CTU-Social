import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Checkbox,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import { HiMiniLockOpen } from "react-icons/hi2";
import { SearchIcon } from "@chakra-ui/icons";
import { useSearchParams } from "react-router-dom";

const UserTable = ({ allAccount, handleUser, fetchAccounts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  // Hàm lọc tài khoản dựa trên từ khóa tìm kiếm

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
      fetchAccounts(searchTerm || "");
    }
  };
  return (
    <Box p={4} borderRadius="lg" w={"100%"}>
      <Flex justifyContent={"right"} mt={"2px"}>
        <InputGroup mb={4} w={"300px"}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </InputGroup>
      </Flex>

      <Table colorScheme="blue" size="sm">
        <Thead>
          <Tr>
            <Th fontSize="sm">Người dùng</Th>
            <Th fontSize="sm">Email</Th>
            <Th fontSize="sm">Trạng thái</Th>
            <Th fontSize="sm">Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {allAccount.accounts.map((user) => (
            <Tr key={user._id} _hover={{ bg: "blue.50" }} fontSize="sm">
              <Td>{user.userName}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Box
                  px={2}
                  py={1}
                  borderRadius="md"
                  textAlign={"center"}
                  color={"white"}
                  bg={!user.Blocked ? "green.400" : "red.400"}
                  boxShadow="sm"
                  transition="background 0.3s ease"
                  _hover={{
                    bg: !user.Blocked ? "green.500" : "red.500",
                  }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="sm"
                  h={"30px"}
                  w={"120px"}
                >
                  {!user.Blocked ? (
                    <FaCheck />
                  ) : (
                    <Box fontSize={"20px"}>
                      <IoCloseSharp />
                    </Box>
                  )}
                  <span style={{ marginLeft: "0.5rem" }}>
                    {!user.Blocked ? "Hoạt động" : "Bị khóa"}
                  </span>
                </Box>
              </Td>
              <Td>
                {!user.Blocked ? (
                  <Button
                    onClick={() => handleUser(user._id, "block")}
                    colorScheme="red"
                    variant="outline"
                    h={"20px"}
                    w={"100px"}
                    fontSize={"12px"}
                    mb={"5px"}
                    mr={1}
                    _hover={{ bg: "red.600", color: "white" }}
                    leftIcon={
                      <Box fontSize={"15px"}>
                        <MdBlock />
                      </Box>
                    }
                  >
                    Khóa
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUser(user._id, "unblock")}
                    colorScheme="green"
                    variant="outline"
                    h={"20px"}
                    w={"100px"}
                    mb={"5px"}
                    fontSize={"12px"}
                    _hover={{ bg: "green.100" }}
                    leftIcon={
                      <Box fontSize={"15px"}>
                        <HiMiniLockOpen />
                      </Box>
                    }
                  >
                    Mở khóa
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserTable;
