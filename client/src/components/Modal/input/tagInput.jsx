/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useEffect, useState } from "react";
import {
  Input,
  InputGroup,
  List,
  ListItem,
  Box,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { useDebounce } from "use-debounce";
import axios from "axios";
import TagSelected from "./tagSelected";
import BlogApi from "../../../apis/blogApi";

const TagInput = memo(({ setData, EditTagList }) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue] = useDebounce(inputValue, 500); // Sử dụng debounce với thời gian 500ms
  const [tags, setTags] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tagSelected, setTagSelected] = useState(EditTagList || []);

  useEffect(() => {
    setData((prevData) => ({ ...prevData, tags: tagSelected }));
  }, [tagSelected, setData]);

  useEffect(() => {
    if (debouncedInputValue.length > 1) {
      // Gọi API lấy tags bằng Axios
      const fetchTags = async () => {
        try {
           const response = await BlogApi.getTag(`posts/tag?query=${debouncedInputValue}`)
          // console.log(response)
          setSuggestions(response);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Lỗi khi lấy tags:", error);
          setSuggestions([]);
        }
      };
      fetchTags();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedInputValue]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleTagSelected = (value) => {
    setTagSelected((prev) => {
      const newTags = [...prev, value];
      return newTags;
    });
    setShowSuggestions(false);
    setInputValue("");
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue !== "") {
      handleTagSelected(inputValue);
    }
  };

  const removeTag = (value) => {
    setTagSelected(() => {
      const newTags = tagSelected.filter((item) => item !== value);
      return newTags;
    });
  };

  return (
    <FormControl id="title">
      <FormLabel>Tags</FormLabel>
      {tagSelected.length > 0 && (
        <HStack spacing="5px" w="100%">
          {tagSelected.map((tagName, key) => (
            <TagSelected key={key} tagName={tagName} removeTag={removeTag} />
          ))}
        </HStack>
      )}
      <InputGroup zIndex={99999999}>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Nhập tags"
          onKeyDown={handleKeyDown}
        />
        {showSuggestions && (
          <Box position="absolute" borderRadius="md" p={2} mt={5} w="100%">
            {suggestions.length > 0 && (
              <List
                minH="20px"
                spacing={2}
                bgColor="white"
                p="10px"
                mt="12px"
                border="1px solid #7B8785"
                borderRadius="5px"
              >
                {suggestions.map((suggestion) => (
                  <ListItem
                    key={suggestion.id}
                    cursor="pointer"
                    onMouseDown={() => handleTagSelected(suggestion.TenTag)}
                  >
                    {suggestion.TenTag}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </InputGroup>
    </FormControl>
  );
});
TagInput.displayName = "TagInput";
export default TagInput;
