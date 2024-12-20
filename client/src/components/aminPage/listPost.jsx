import { HStack, List, ListItem, Text } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { blogDetailClear, reloadDetailBlog } from "../../Redux/slices/blogSlice";
const ListPost = ({ getPostsByDate, selectedDate }) => {
  const dispatch = useDispatch()
  const navigate =  useNavigate()
  const userInteract = useSelector(state => state.auth.userDetail)
  return (
    <List spacing={3}  maxHeight={'350px'}
    overflow={'auto'}>
      {getPostsByDate(selectedDate).map((post) => (
        <ListItem
          key={post._id}
          borderWidth="1px"
          p={4}
          borderRadius="md"
          boxShadow="sm"
          mb={4}
          cursor={'pointer'}
         onClick={()=>{
          dispatch(blogDetailClear());
          dispatch(reloadDetailBlog(`posts/reload/${post._id}`));
          setTimeout(() => {
            const filteredData = userInteract.BaiDang.filter(item => item._id === post._id);
          //  console.log(filteredData)
            const data = filteredData.length > 0;
            
            data
              ? navigate(`/account/user/post/${post._id}`)
              : navigate(
                  `/account/guest/${post.TaiKhoan_id._id}/post/${post._id}`
                );
          }, 1000);
         }}
        >
          <Text fontSize="lg" fontWeight="bold">
            {post.TieuDe}
          </Text>

          {/* Hiển thị nội dung bài viết với giới hạn số dòng */}
          <Text
            mt={2}
            dangerouslySetInnerHTML={{ __html: post.NoiDung }}
            noOfLines={3}
          />

          <HStack mt={2} spacing={4}>
            {/* Hiển thị tên người đăng */}
            <Text fontSize="sm" color="gray.500">
              Người đăng: {post.TaiKhoan_id.userName}
            </Text>

            {/* Hiển thị số lượt thích */}
            <Text fontSize="sm" color="blue.500">
              Lượt thích: {post.LikedBy.length}
            </Text>

            {/* Hiển thị số lượt bình luận */}
            <Text fontSize="sm" color="green.500">
              Lượt bình luận: {post.BinhLuan.length}
            </Text>

            {/* Hiển thị số lượt lưu */}
            <Text fontSize="sm" color="purple.500">
              Lượt lưu: {post.SavedBy.length}
            </Text>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
};

export default ListPost;
