/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
  Spinner,
  FormControl,
  HStack,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";
import { FiUpload, FiCheckCircle } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useToast } from "@chakra-ui/react";

const FileUpload = memo(({ setData, editFileList, editMode }) => {
  // console.log(1)
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayList, setDisplayList] = useState(editFileList || []);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const inputRef = useRef(null);
  useEffect(() => {
    editMode
      ? setData((prevData) => ({ ...prevData, files_update: uploadedFiles }))
      : setData((prevData) => ({ ...prevData, files: uploadedFiles }));
  }, [uploadedFiles]);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    //  console.log(event.target.files[0]);
  };

  const displayToast = (status, title, description) => {
    toast({
      title: title,
      description: description,
      status: status,
      position: "top",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleUpload = () => {
    setUploading(true);
    //  console.log(selectedFile);
    if (!selectedFile) {
      setUploading(false);
      displayToast("error", "Lỗi tải file", "Chưa tải lên file");
    } else {
      if (uploadedFiles.length === 4) {
        setUploading(false);
        displayToast("error", "Lỗi file", "Chỉ được tải lên tối đa 4 file");
      } else {
        setTimeout(() => {
          const existingFile = uploadedFiles.find(
            (file) => file.name === selectedFile.name
          );
          if (!existingFile) {
            displayToast(
              "success",
              "Thành công",
              `File ${selectedFile.name} đã được tải lên`
            );
            setUploadedFiles(() => {
              const listFile = [...uploadedFiles, selectedFile];
              return listFile;
            });
            setDisplayList(() => {
              const listFile = [...displayList, selectedFile];
              return listFile;
            });
            setSelectedFile(null);
          } else {
            displayToast(
              "error",
              "Lỗi tải file",
              `File ${selectedFile.name} đã tồn tại`
            );
          }
          setUploading(false);
          inputRef.current.value = "";
        }, 2000);
      }
    }
  };
  const removeFile = (index) => {
    const newIndex = editMode ? index - editFileList.length : index;
    setDisplayList(displayList.filter((_, i) => i !== index));
    if (editMode && index < editFileList.length) {
      setData((prevData) => ({
        ...prevData,
        files: editFileList.filter((_, i) => i !== index),
      }));
    } else {
      setUploadedFiles(() => {
        const listFile = uploadedFiles.filter((_, i) => i !== newIndex);
        return listFile;
      });
    }
  };
  return (
    <FormControl>
      <Flex gap={"232px"}>
        <Text fontWeight={"500"}>Tải file lên</Text>
        {displayList.length > 0 ? (
          <Text fontWeight={"500"}>Danh sách file</Text>
        ) : (
          ""
        )}
      </Flex>
      <HStack spacing={"15px"} mt={"10px"}>
        <Box w={"30%"}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiUpload} />
            </InputLeftElement>
            <Input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              display="none"
            />
            <Input
              type="text"
              value={selectedFile ? selectedFile.name : ""}
              placeholder="Chọn tệp tin"
              onClick={() => inputRef.current.click()}
              cursor={"pointer"}
              readOnly
            />
          </InputGroup>
          {uploading ? (
            <Spinner mt={"15px"} />
          ) : (
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={handleUpload}
              mt={2}
            >
              Tải lên
            </Button>
          )}
        </Box>
        <VStack align={"start"} h={"100px"}>
          {displayList.length > 0 &&
            displayList.map((file, index) => (
              <Flex key={index} justifyContent={"left"} gap={"10px"} mt={"3px"}>
                <FiCheckCircle color="green" style={{ marginTop: "3px" }} />
                <Text
                  fontSize="sm"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  maxWidth={"150px"}
                >
                  {file.name}
                </Text>
                <RiDeleteBin5Line
                  style={{
                    marginTop: "3px",
                    cursor: "pointer",
                  }}
                  onClick={() => removeFile(index)}
                  color="red"
                />
              </Flex>
            ))}
        </VStack>
      </HStack>
    </FormControl>
  );
});
FileUpload.displayName = "FileUpload";
export default FileUpload;
