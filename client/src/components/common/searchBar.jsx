import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSuggestions } from "../../Redux/slices/globalSlice";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false); // Trạng thái để theo dõi hiển thị gợi ý
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filteredSuggestions = useSelector(state => state.global.searchSuggest);
  const userDetail = useSelector(state => state.auth.userDetail)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      const fetchSuggestions = async () => {
        await dispatch(getSuggestions(`infos/search/suggest?keyword=${debouncedQuery}`));
        setIsLoading(false);
      };
      fetchSuggestions();
    } else {
      setIsLoading(false);
    }
  }, [debouncedQuery, dispatch]);
  return (
    <Flex
      as="form"
      onSubmit={(e) => e.preventDefault()}
      w="100%"
      maxW="400px"
      mx="auto"
      py="4"
      direction="column"
    >
      <Box position="relative" w="100%">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.400" />
          </InputLeftElement>
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            borderRadius="full"
            border="2px #ffffff solid"
            focusBorderColor="white"
            _placeholder={{ color: "white", fontWeight: '500' }}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true); // Hiển thị gợi ý khi người dùng nhập
            }}
            onFocus={() => setShowSuggestions(true)} // Hiển thị gợi ý khi input được chọn
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Ẩn gợi ý khi mất tiêu điểm
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                navigate(`/search/result/${query}`);
                setQuery(""); // Xóa truy vấn để ẩn gợi ý
                setShowSuggestions(false); // Ẩn gợi ý
              }
            }}
          />
        </InputGroup>
        {debouncedQuery && isLoading && (
          <Box
            position="absolute"
            top="100%"
            left="0"
            width="100%"
            mt="2"
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            shadow="lg"
            zIndex="1"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50px"
          >
            <Spinner size="sm" />
          </Box>
        )}
        {debouncedQuery && !isLoading && showSuggestions && filteredSuggestions?.length > 0 && (
          <Box
            position="absolute"
            top="100%"
            left="0"
            width="100%"
            mt="2"
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            shadow="lg"
            maxH="200px"
            overflowY="auto"
            zIndex="1"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <Box
                key={index}
                px="4"
                color={'black'}
                py="2"
                _hover={{ bg: "blue.50", color: "blue.700", cursor: "pointer" }}
                borderBottom={index < filteredSuggestions.length - 1 ? "1px solid" : "none"}
                borderColor="gray.100"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  navigate(`/search/result/${suggestion.name}`);
                  setQuery(""); // Xóa truy vấn để ẩn gợi ý
                  setShowSuggestions(false); // Ẩn gợi ý khi click vào gợi ý
                }}
              >
                <Text fontSize="sm" fontWeight="medium">
                  {suggestion.name}
                </Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default SearchBar;
