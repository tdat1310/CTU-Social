import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';
import React from 'react';
import { FaHashtag } from "react-icons/fa6";

const TagSelected = ({ tagName, removeTag }) => {
  return (
    <Tag
      size={'lg'}
      borderRadius='full'
      variant='solid'
      bgColor={'blue.500'}
      mb={'10px'}
    >
      <FaHashtag />
      <TagLabel>{tagName}</TagLabel>
      <TagCloseButton onClick={()=>removeTag(tagName)} />
    </Tag>
  );
}

export default TagSelected;
