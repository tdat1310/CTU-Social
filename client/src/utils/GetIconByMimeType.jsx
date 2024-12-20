import { FaFile, FaFileAlt } from "react-icons/fa";
import {
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileVideo,
  FaFileAudio,
  FaFilePowerpoint,
  FaFileCode,
} from "react-icons/fa6";
import { BiSolidFileArchive } from "react-icons/bi";
import { Box } from "@chakra-ui/react";

const GetIconByMimeType = ({ mimeType }) => {
  const iconSize = "24px"; // Kích thước mặc định cho icon
  const boxBg = "white"; // Màu nền của Box
  const boxBorderRadius = "md"; // Đường bo tròn của Box
  const boxPadding = "4px"; // Khoảng đệm bên trong Box

  switch (true) {
    case mimeType.startsWith("image/"):
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <FaFileImage color="#f28b82" size={iconSize} />
        </Box>
      );
    case mimeType.startsWith("video/"):
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <FaFileVideo color="#fbbc04" size={iconSize} />
        </Box>
      );
    case mimeType.startsWith("audio/"):
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <FaFileAudio color="#34a853" size={iconSize} />
        </Box>
      );
    case mimeType === "application/pdf":
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <FaFilePdf color="#ea4335" size={iconSize} />
        </Box>
      );
    case mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <FaFileWord color="#4285f4" size={iconSize} />
        </Box>
      );
    case mimeType === "application/vnd.ms-excel" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "text/csv":
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <FaFileExcel color="#0f9d58" size={iconSize} />
        </Box>
      );
    case mimeType === "application/vnd.ms-powerpoint" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <FaFilePowerpoint color="#ea4335" size={iconSize} />
        </Box>
      );
    case mimeType === "application/zip" ||
      mimeType === "application/x-rar-compressed":
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <BiSolidFileArchive color="#fbbc04" size={iconSize} />
        </Box>
      );
    case mimeType.startsWith("text/") || mimeType === "application/json":
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <FaFileCode color="#34a853" size={iconSize} />
        </Box>
      );
    default:
      return (
        <Box bg={boxBg} borderRadius={boxBorderRadius} p={boxPadding}>
          <FaFileAlt color="#5f6368" size={iconSize} />
        </Box>
      );
  }
};

export default GetIconByMimeType;
