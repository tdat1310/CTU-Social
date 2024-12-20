import { Tag, Text } from "@chakra-ui/react";

const TagResult = ({ tag, navigate }) => (
  <Tag
    size="lg"
    colorScheme="blue"
    variant="solid"
    onClick={() => {
      navigate(`/tags/${tag.TenTag}/${tag._id}`);
    }}
    cursor={'pointer'}
  >
    <Text fontSize={"20px"} mb={"2px"} mr={"2px"}>
      #
    </Text>{" "}
    {tag.TenTag}
  </Tag>
);

export default TagResult;
