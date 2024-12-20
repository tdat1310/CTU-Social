import React from 'react';
import { Box, Image } from '@chakra-ui/react';
import { RiDeleteBin5Fill } from "react-icons/ri";
/**
 * PicWrap là một thành phần bao gồm hình ảnh và nút xóa.
 * @param {string} src - Đường dẫn đến hình ảnh.
 * @param {function} onDelete - Hàm được gọi khi nút xóa được nhấp.
 */
const PicWrap = ({ src, onDelete, id }) => {
  return (
    <Box 
      position="relative" 
      width="fit-content" 
      borderRadius="10px"  
      border="1px solid #DFE0DC" 
      padding="10px"
      overflow="hidden"
      onClick={() => onDelete(id)}
      cursor={'pointer'}
      _hover={{
        '.image': {
          transform: 'scale(1.2)',
        },
        '.overlay': {
          opacity: 1,
          filter: 'blur(1.3px)',
        },
        '.delete-icon': {
          display: 'flex',
          opacity: 1,
        }
      }}
    >
      <Image 
        src={src}  
        boxSize="150px" 
        objectFit="cover" 
        borderRadius="inherit"
        className="image"
        transition="transform 0.3s ease, filter 0.3s ease"
      />

      <Box
        className="overlay"
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background="linear-gradient(0deg, rgba(255,0,0,0.5) 2px, transparent 1px) 0 0,
                    linear-gradient(90deg, rgba(255,0,0,0.5) 2px, transparent 1px) 0 0"
        backgroundSize="8px 8px"
        borderRadius="inherit"
        opacity={0}
        transition="opacity 0.3s ease"
      />
      
      <Box 
        className="delete-icon"
        display="none"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        alignItems="center"
        justifyContent="center"
        opacity={0}
        transition="opacity 0.3s ease"
      >
        <RiDeleteBin5Fill 
          style={{
            fontSize: '30px',
            cursor: 'pointer',
            color: 'white',
          }}
        />
      </Box>
    </Box>
  );
};

export default PicWrap;
